// import parent from '../../../render/dom/parent'
// import { property } from '../../../render/static'
import { getClass } from '../../../get'
import StyleSheet from './render'
import { get, puid } from 'brisky-struct'
import prefix from '../prefix'

const reversePrefix = {}
for (const i in prefix) {
  reversePrefix[prefix[i]] = i
}
var inProgress

const globalSheet = {
  map: {},
  count: 0
}

const isNotEmpty = store => {
  for (let i in store) return true
}

const toDash = key => key.replace(/([A-Z])([a-z]|$)/g, '-$1$2').toLowerCase()

// const addKey = (t, key) => {

const uid = (num, map) => {
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
  // const mediaMap = style.mediaMap
  const newStyle = []
  // var mc = 0
  // console.log('DOOO', store)
  let keys = store.keys()
  let i = keys.length
  while (i--) {
    let key = keys[i]
    let val = get(store, key)
  // for (let key in store) {
    if (key.indexOf('@media') === 0) {
      // if (!mediaMap[key]) mediaMap[key] = { id: ++mediaMap.count, count: 0, state: {} }
      // const mmap = mediaMap[key]
      // const parsed = val
      // for (let style in parsed) {
      //   const value = parsed[style]
      //   if (typeof value === 'object' && 'inherits' in value) {
      //     const id = uid(++mc) + ((pid * 33 ^ puid(value)) >>> 0)
      //     mmap.state[id] = toDash(style) + ':' + t.get([key, reversePrefix[style] || style]).compute(value, value)
      //     className += ` ${id}`
      //   } else {
      //     const s = toDash(style) + ':' + value
      //     if (!mmap[s]) {
      //       mmap[s] = uid(mmap.count++) + mmap.id
      //     }
      //     className += ` ${mmap[s]}`
      //   }
      //   // this also has to be resolved of course....
      // }
    } else {
      if (val === '0px') val = 0
      let s = toDash(key) + ':' + val
      if (!map[s]) {
        let id
        id = uid(globalSheet.count++, globalSheet.map)
        if (!globalSheet.map[s]) globalSheet.map[s] = id
        const rule = globalSheet.map[s]
        map[s] = rule
        newStyle.push(s)
      }
      className += ' ' + map[s]
    }
  }
  if (style.parsed) {
    if (newStyle.length) style.update(newStyle, map)
  } else if (!inProgress && 'node' in elem) {
    style.exec(elem.node)
  }
  return className
}

const s = (t, node) => {
  const store = t
  const elem = inProgress || t.root()
  if (!getClass(t._p)) {
    if (isNotEmpty(store)) {
      if (t._p.get('tag') === 'svg') {
        node.setAttribute('class', setStyle(t, store, elem))
      } else {
        node.className = setStyle(t, store, elem)
      }
    }
  } else {
    const style = node.getAttribute('data-style')
    if (isNotEmpty(store)) {
      const newStyle = setStyle(t, store, elem)
      if (newStyle) {
        if (style) {
          if (newStyle !== style) {
            if (t._p.get('tag') === 'svg') {
              node.setAttribute('class', node.getAttribute('class').replace(style, newStyle))
            } else {
              node.className = node.className.replace(style, newStyle)
            }
          }
        } else {
          if (t._p.get('tag') === 'svg') {
            node.setAttribute('class', node.getAttribute('class') + newStyle)
          } else {
            node.className = (node.className || '') + newStyle
          }
        }
        node.setAttribute('data-style', newStyle)
        return
      }
    }
    if (style) node.removeAttribute('data-style')
  }
}

// const sheet = {
//   type: 'group',
//   render: {
//     state (t, s, type, subs, tree, id, pid, store) {
//       const node = parent(tree, pid)
//       if (node) t.groupRender.static(t, node, store, pid)
//     },
//     static (t, node, store, pid) { // state gets passed by render.state
//       const elem = inProgress || t.root()
//       if (!getClass(t._p._p)) {
//         if (isNotEmpty(store)) {
//           if (t._p._p.get('tag') === 'svg') {
//             node.setAttribute('class', setStyle(t, store, elem, pid))
//           } else {
//             node.className = setStyle(t, store, elem, pid)
//           }
//         }
//       } else {
//         const style = node.getAttribute('data-style')
//         if (isNotEmpty(store)) {
//           const newStyle = t._cachedNode = setStyle(t, store, elem, pid)
//           if (newStyle) {
//             if (style) {
//               if (newStyle !== style) {
//                 if (t._p._p.get('tag') === 'svg') {
//                   node.setAttribute('class', node.getAttribute('class').replace(style, newStyle))
//                 } else {
//                   node.className = node.className.replace(style, newStyle)
//                 }
//               }
//             } else {
//               if (t._p._p.get('tag') === 'svg') {
//                 node.setAttribute('class', node.getAttribute('class') + newStyle)
//               } else {
//                 node.className = (node.className || '') + newStyle
//               }
//             }
//             node.setAttribute('data-style', newStyle)
//             return
//           }
//         }
//         if (style) node.removeAttribute('data-style')
//       }
//     }
//   },
//   props: {
//     default: {
//       render: {
//         static (t, node, store) {
//           const val = t.compute()
//           const key = t.key
//           if (val === void 0) {
//             property(t, node, store[key] = {})
//           } else {
//             store[key] = prefixVal[key] ? prefixVal[key](val) : val
//           }
//         },
//         state (t, s, type, subs, tree, id, pid, order) {
//           const p = t._p
//           const store = t.getStore(tree, pid + p.key)
//           if (!s || s.val === null || type === 'remove') {
//             if (t.key in store) {
//               delete store[t.key]
//             }
//           } else {
//             const val = t.compute(s, s)
//             if (val !== void 0 && typeof val !== 'object') {
//               store[t.key] = val
//               p.render.state(p, s, type, subs, tree, id, pid, order, store)
//             } else {
//               property(t, false, store[t.key] || (store[t.key] = {}))
//             }
//           }
//         }
//       },
//       props: {
//         default: {
//           render: {
//             static (t, node, store) {
//               const key = t.key
//               store[prefix[key] || key] = prefixVal[key]
//                 ? prefixVal[key](t.compute())
//                 : t.compute()
//             },
//             state (t, s, type, subs, tree, id, pid, order) {
//               const p = t._p
//               const path = [ t.key, p.key ]
//               const pp = p._p
//               const pstore = p.getStore.call(t, tree, pid + pp.key)
//               var store = pstore
//               var i = path.length - 1
//               for (; i >= 1; i--) {
//                 store = store[path[i]]
//               }
//               var key = path[i]
//               if (key in prefix) {
//                 key = prefix[key]
//               }
//               if (!s || s.val === null || type === 'remove') {
//                 if (key in store) {
//                   delete store[key]
//                 }
//               } else {
//                 store[key] = s
//               }
//               pp.render.state(pp, s, type, subs, tree, id, pid, order, pstore)
//             }
//           }
//         }
//       }
//     }
//   }
// }

const clear = () => {
  globalSheet.count = 0
  globalSheet.map = {}
}

const done = (elem, resolve, create) => {
  if (create) elem.stylesheet = new StyleSheet(elem, globalSheet)
  if (elem.stylesheet) elem.stylesheet.exec(elem.node, resolve)
  inProgress = void 0
}

const render = t => { inProgress = t }

export { clear, render, done, s }
