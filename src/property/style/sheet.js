import { getClass } from '../../get'

var inProgress

const globalSheet = {
  map: {},
  count: 0
}

class StyleSheet {
  constructor (t) {
    this.sheet = ''
    this.map = {}
    this.mediaMap = { count: 0 }
    this.parsed = false
    t.stylesheet = this
  }
  parse () {
    var str = this.sheet
    const mediaMap = this.mediaMap
    var media = ''
    for (let key in mediaMap) {
      if (key !== 'count') {
        media += ` ${key} {`
        for (let style in mediaMap[key]) {
          if (style !== 'count' && style !== 'id') {
            media += ` .${mediaMap[key][style]} {${style};}`
          }
        }
        media += ' }'
      }
    }
    // replace media
    if (media) str += ' ' + media
    return str + ' '
  }
  init (node) {
    const style = document.createElement('style')
    style.innerHTML = this.parse()
    node = insertInHead(node)
    let i = node.childNodes.length
    while (i--) {
      if (node.childNodes[i].tagName.toLowerCase() === 'style') {
        this.parsed = node.childNodes[i]
        // this.parsed.innerHTML = this.parse()
        return this.parsed
      }
    }
    node.appendChild(style)
    this.parsed = style
    return this.parsed
  }
  update () {
    this.parsed.innerHTML = this.parse()
  }
}

const isNotEmpty = store => {
  for (let i in store) { return true }
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
      // prefix (and multiply for server)
      let s = toDash(key) + ':' + store[key]

      // why does this end up diffferently for browser then node ... :/
      if (!map[s]) {
        let id
        if (elem.resolve) {
          // clean this up nicely...
          const style = elem.stylesheet.init(elem.node)
          let re = new RegExp('\\.([a-z]{1,10}) \\{' + s + ';\\}')
          let m = style.innerHTML.match(re)
          if (m && m[1]) {
            id = m[1]
          } else {
            id = uid(globalSheet.count++)
          }
        } else {
          id = uid(globalSheet.count++)
        }

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
    state: () => {
      // need to add style later
      // console.error('???')
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

const insertInHead = node => {
  if (node.tagName.toLowerCase() === 'html') { // tmp fix for node.js
    let head
    const children = node.childNodes
    for (let i = 0, len = children.length; i < len; i++) {
      if (children[i].tagName && children[i].tagName.toLowerCase() === 'head') {
        head = children[i]
        break
      }
    }
    if (!head) {
      head = document.createElement('head')
      node.appendChild(head)
    }
    return head
  }
  return node
}

const done = (elem, node) => {
  // if resolve then resolve styles names to start
  if (elem.stylesheet && !elem.stylesheet.parsed) elem.stylesheet.init(node)
  inProgress = void 0
}

const render = t => { inProgress = t }

export { sheet, clear, render, done }
