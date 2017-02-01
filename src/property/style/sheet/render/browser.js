import getNode from './node'

export default class StyleSheet {
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
    // will become a class list in the browser
    if (media) str += ' ' + media
    return str + ' '
  }
  init (node) {
    const style = document.createElement('style')
    style.innerHTML = this.parse()
    node = getNode(node)
    let i = node.childNodes.length
    while (i--) {
      if (node.childNodes[i].tagName && node.childNodes[i].tagName.toLowerCase() === 'style') {
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
