import { getClass } from '../../../get'
import StyleSheet from './render'

var inProgress

const globalSheet = {
  map: {},
  count: 0
}

const isNotEmpty = store => {
  for (let i in store) { return true }
}

const toDash = key => key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()

// this is pretty complex
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
  const style = elem.stylesheet || new StyleSheet(elem)
  const map = style.map
  const mediaMap = style.mediaMap
  for (let key in store) {
    if (key.indexOf('@media') === 0) {
      if (!mediaMap[key]) mediaMap[key] = { id: ++mediaMap.count, count: 0 }
      const mmap = mediaMap[key]
      const parsed = t.get(key).serialize()
      for (let style in parsed) {
        let s = toDash(style) + ':' + parsed[style]
        if (!mmap[s]) mmap[s] = uid(mmap.count++) + mmap.id
        className += ` ${mmap[s]}`
      }
    } else {
      let s = toDash(key) + ':' + store[key]
      if (!map[s]) {
        let id
        id = uid(globalSheet.count++)
        if (!globalSheet.map[s]) globalSheet.map[s] = id
        const rule = globalSheet.map[s]
        map[s] = rule
        style.sheet += ` .${rule} {${s};}`
      }
      className += ' ' + map[s]
    }
  }
  if (style.parsed) {
    if (!elem.resolve) {
      // should never be nessecary....
      style.update()
    }
  } else if (!inProgress) {
    style.init(elem.node)
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
    state: () => {},
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

const resolve = elem => {
  // this is mostly browser of course
  console.log('RESOLVE STYLESHEET')
  // if (elem.resolve) {
  // // clean this up nicely... very dirty not nessecary either since were going to use update and there will be a map avaible before hand
  // const style = elem.stylesheet.init(elem.node)
  // let re = new RegExp('\\.([a-z]{1,10}) \\{' + s + ';\\}')
  // let m = style.innerHTML.match(re)
  // if (m && m[1]) {
  //   id = m[1]
  // } else {
  //   id = uid(globalSheet.count++)
  // }
}

const done = elem => {
  if (elem.stylesheet) elem.stylesheet.init(elem.node)
  inProgress = void 0
}

const render = t => { inProgress = t }

export { sheet, clear, render, resolve, done }
