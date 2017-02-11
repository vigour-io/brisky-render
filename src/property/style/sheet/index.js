import parent from '../../../render/dom/parent'
import { getClass, get$ } from '../../../get'
import StyleSheet from './render'

var inProgress

const globalSheet = {
  map: {},
  count: 0
}

const isNotEmpty = store => {
  for (let i in store) return true
}

const toDash = key => key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()

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

const setStyle = (t, store, elem) => {
  var className = ''
  const style = elem.stylesheet || new StyleSheet(elem, globalSheet)
  const map = style.map
  const mediaMap = style.mediaMap
  // console.log('yes!', mediaMap)
  for (let key in store) {
    if (key.indexOf('@media') === 0) {
      if (!mediaMap[key]) mediaMap[key] = { id: ++mediaMap.count, count: 0 }
      const mmap = mediaMap[key]
      const parsed = t.get(key).serialize()
      for (let style in parsed) {
        let s = toDash(style) + ':' + parsed[style]
        if (!mmap[s]) mmap[s] = uid(mmap.count++) + mmap.id
        // this also has to be resolved of course....
        className += ` ${mmap[s]}`
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
      // const node = parent(tree, pid)
      // if (node) t.groupRender.static(t, node, store)
    },
    static (t, node, store) {
      const elem = inProgress || t.root()
      if (!getClass(t._p._p)) {
        if (isNotEmpty(store)) {
          node.className = setStyle(t, store, elem)
        }
      } else {
        const style = node.getAttribute('data-style')
        if (isNotEmpty(store)) {
          const newStyle = t._cachedNode = setStyle(t, store, elem)
          if (newStyle) {
            setClass(node, newStyle, style)
            return
          }
        }
        if (style) node.removeAttribute('data-style')
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
