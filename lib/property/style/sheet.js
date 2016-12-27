import { getClass, cache } from '../../get'

var inProgress

const globalSheet = {
  map: {},
  count: 0
}

class StyleSheet {
  constructor (t) {
    this.sheet = ''
    this.map = {}
    this.mediaMap = {}
    t.stylesheet = this
  }
  init (node) {
    const style = document.createElement('style')
    const mediaMap = this.mediaMap
    var media = ''
    for (let key in mediaMap) {
      media += ` ${key} {`
      for (let style in mediaMap[key]) {
        media += ` ._${style} {${mediaMap[key][style]};}`
      }
      media += ' }'
    }
    if (media) this.sheet += ' ' + media
    style.innerHTML = this.sheet + ' '
    node.appendChild(style)
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

const setStyle = (t, store, media) => {
  var start = t
  var className = media || ''
  const style = inProgress.stylesheet || new StyleSheet(inProgress)
  const map = style.map
  const mediaMap = style.mediaMap
  for (let key in store) {
    if (key.indexOf('@media') === 0) {
      if (!mediaMap[key]) mediaMap[key] = {}
      const parsed = setStyle(start, start.get(key).serialize(), {})
      for (let style in parsed) {
        mediaMap[key][style] = parsed[style]
        className += ' _' + style
      }
    } else {
      // prefix (and multiply for server)
      let s = toDash(key) + ':' + store[key]
      if (!map[s]) {
        if (!globalSheet.map[s]) globalSheet.map[s] = uid(globalSheet.count++)
        const rule = globalSheet.map[s]
        map[s] = rule
        style.sheet += ` .${rule} {${s};}`
      }
      if (media) {
        className[map[s]] = s
      } else {
        className += ' ' + map[s]
      }
    }
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
  node.setAttribute('data-styletron', newStyle)
}

const sheet = {
  type: 'group',
  render: {
    state: () => {
      // console.error('???')
    },
    static (t, node, store) {
      if (inProgress) {
        if (!getClass(t._p._p)) {
          if (isNotEmpty(store)) {
            node.className = t._cachedNode = setStyle(t, store)
          }
        } else {
          const style = node.getAttribute('data-styletron')
          if (isNotEmpty(store)) {
            const newStyle = t._cachedNode = setStyle(t, store)
            if (newStyle) {
              setClass(node, newStyle, style)
              return
            }
          }
          if (style) node.removeAttribute('data-styletron')
        }
      } else if (cache(t)) {
        setClass(node, cache(t))
      }
    }
  }
}

const clear = () => {
  globalSheet.count = 0
  globalSheet.map = {}
}

const done = (elem, node) => {
  if (elem.stylesheet) elem.stylesheet.init(node)
  inProgress = void 0
}

const render = t => { inProgress = t }

export { sheet, clear, render, done }
