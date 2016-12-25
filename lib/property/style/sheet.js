import { getClass } from '../../get'

class StyleSheet {
  constructor (t) {
    this.sheet = ''
    this.map = {}
    this.mediaMap = {}
    this.count = 0
    this.mediaCount = 0
    t.stylesheet = this
  }
  init (node) {
    const style = document.createElement('style')
    const mediaMap = this.mediaMap
    var media = ''
    for (let key in mediaMap) {
      media += `${key} {`
      for (let style in mediaMap[key]) {
        media += `\n ._${style} { ${mediaMap[key][style]}; }`
      }
      media += '\n}'
    }
    if (media) this.sheet += '\n\n' + media
    style.innerHTML = this.sheet + '\n'
    node.appendChild(style)
  }
}

const isNotEmpty = store => {
  for (let i in store) {
    return true
  }
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
  var style
  var last
  while (t && !style) {
    style = t.stylesheet
    if (!style) {
      last = t
      t = t.parent()
    }
  }
  if (style === void 0) style = new StyleSheet(last)
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
        const rule = uid(style.count++)
        map[s] = rule
        style.sheet += `\n .${rule} { ${s}; }`
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

const sheet = {
  type: 'group',
  render: {
    state: () => {
      // console.log('???')
    },
    static (t, node, store) {
      if (!getClass(t._p._p)) {
        if (isNotEmpty(store)) node.className = setStyle(t, store)
      } else {
        const style = node.getAttribute('data-styletron')
        if (isNotEmpty(store)) {
          const newStyle = setStyle(t, store)
          if (newStyle) {
            if (style) {
              if (newStyle !== style) {
                node.className = node.className.replace(style, newStyle)
              }
            } else {
              node.className = (node.className || '') + newStyle
            }
            node.setAttribute('data-styletron', newStyle)
            return
          }
        }
        if (style) node.removeAttribute('data-styletron')
      }
    }
  }
}

export default sheet
