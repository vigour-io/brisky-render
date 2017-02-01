import getNode from './node'

export default class StyleSheet {
  constructor (t) {
    this.map = {}
    this.mediaMap = { count: 0 }
    this.parsed = false
    this.elem = t
    t.stylesheet = this
  }
  parse () {
    var str = ''
    for (let i in this.map) {
      str += ` .${this.map[i]} {${i};}`
    }
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
    if (media) str += ' ' + media
    return str + ' '
  }
  exec (node, resolve) {
    if (!this.parsed) {
      const style = document.createElement('style')
      style.setAttribute('data-style', true)
      style.innerHTML = this.parse()
      getNode(node).appendChild(style)
      this.parsed = style
      return style
    }
  }
  update () {
    if (this.parsed) {
      this.parsed.innerHTML = this.parse()
    }
  }
}
