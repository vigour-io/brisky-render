import parent from '../../../render/dom/parent'
import { property } from '../../../render/static'
import { getClass } from '../../../get'
import StyleSheet from './render'
import { puid } from 'brisky-struct'
import prefixVal from '../prefix/value'
import prefix from '../prefix'

var inProgress

const globalSheet = {
  map: {},
  count: 0
}

const isNotEmpty = store => {
  for (let i in store) return true
}

const toDash = key => key.replace(/([A-Z])([a-z])/g, '-$1$2').toLowerCase()

const uid = num => {
  const div = num / 26 | 0
  var str = String.fromCharCode(97 + num % 26)
  if (div) {
    if (div / 26 | 0) {
      str = str + uid(div)
    } else {
      str = str + String.fromCharCode(97 + div % 26)
    }
  }
  return str
}

const setStyle = (t, store, elem, pid) => {
  var className = ''
  const style = elem.stylesheet || new StyleSheet(elem, globalSheet)
  const map = style.map
  const mediaMap = style.mediaMap
  var mc = 0
  for (let key in store) {
    if (key.indexOf('@media') === 0) {
      if (!mediaMap[key]) {
        mediaMap[key] = { id: ++mediaMap.count, count: 0, state: {} }
      }
      const mmap = mediaMap[key]
      const parsed = store[key]
      for (let style in parsed) {
        const value = parsed[style]
        if (typeof value === 'object' && 'inherits' in value) {
          const id = uid(++mc) + ((pid * 33 ^ puid(value)) >>> 0)
          mmap.state[id] = toDash(style) + ':' + t.get([key, style]).compute(value, value)
          className += ` ${id}`
        } else {
          const s = toDash(style) + ':' + value
          if (!mmap[s]) mmap[s] = uid(mmap.count++) + mmap.id
          className += ` ${mmap[s]}`
        }
        // this also has to be resolved of course....
      }
    } else {
      if (store[key] === '0px') store[key] = 0
      let s = toDash(key) + ':' + store[key]
      if (!map[s]) {
        let id
        id = uid(globalSheet.count++)
        if (!globalSheet.map[s]) globalSheet.map[s] = id
        const rule = globalSheet.map[s]
        map[s] = rule
      }
      className += ' ' + map[s]
    }
  }
  if (style.parsed) {
    style.update()
  } else if (!inProgress) {
    style.exec(elem.node)
  }
  return className
}

const setClass = (node, newStyle, style) => {
  if (style) {
    if (newStyle !== style) {
      node.className = node.className.replace(style, newStyle)
    }
  } else {
    node.className = (node.className || '') + newStyle
  }
  node.setAttribute('data-style', newStyle)
}

const sheet = {
  type: 'group',
  render: {
    state (t, s, type, subs, tree, id, pid, store) {
      const node = parent(tree, pid)
      if (node) t.groupRender.static(t, node, store, pid)
    },
    static (t, node, store, pid) { // state gets passed by render.state
      const elem = inProgress || t.root()
      if (!getClass(t._p._p)) {
        if (isNotEmpty(store)) {
          node.className = setStyle(t, store, elem, pid)
        }
      } else {
        const style = node.getAttribute('data-style')
        if (isNotEmpty(store)) {
          const newStyle = t._cachedNode = setStyle(t, store, elem, pid)
          if (newStyle) {
            setClass(node, newStyle, style)
            return
          }
        }
        if (style) node.removeAttribute('data-style')
      }
    }
  },
  props: {
    default: {
      render: {
        static (t, node, store) {
          const val = t.compute()
          const key = t.key
          if (val === void 0) {
            property(t, node, store[key] = {})
          } else {
            store[key] = prefixVal[key] ? prefixVal[key](val) : val
          }
        },
        state (t, s, type, subs, tree, id, pid, order) {
          const p = t._p
          const store = t.getStore(tree, pid + p.key)
          if (!s || s.val === null || type === 'remove') {
            if (t.key in store) {
              delete store[t.key]
            }
          } else {
            property(t, false, store[t.key] || (store[t.key] = {}))
          }
        }
      },
      props: {
        default: {
          render: {
            static (t, node, store) {
              const key = t.key
              store[prefix[key] || key] = prefixVal[key]
                ? prefixVal[key](t.compute())
                : t.compute()
            },
            state (t, s, type, subs, tree, id, pid, order) {
              const p = t._p
              const path = [ t.key, p.key ]
              const pp = p._p
              const pstore = p.getStore.call(t, tree, pid + pp.key)
              var store = pstore
              var i = path.length - 1
              for (; i >= 1; i--) {
                store = store[path[i]]
              }
              var key = path[i]
              if (key in prefix) {
                key = prefix[key]
              }
              if (!s || s.val === null || type === 'remove') {
                if (key in store) {
                  delete store[key]
                }
              } else {
                store[key] = s
              }
              pp.render.state(pp, s, type, subs, tree, id, pid, order, pstore)
            }
          }
        }
      }
    }
  }
}

const clear = () => {
  globalSheet.count = 0
  globalSheet.map = {}
}

const done = (elem, resolve) => {
  if (elem.stylesheet) elem.stylesheet.exec(elem.node, resolve)
  inProgress = void 0
}

const render = t => { inProgress = t }

export { sheet, clear, render, done }
