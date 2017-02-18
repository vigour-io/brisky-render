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
    const mediaMap = this.mediaMap
    var media = ''
    var str = ''
    for (const i in this.map) {
      str += ` .${this.map[i]} {${i};}`
    }
    console.log('++>', mediaMap)
    for (const key in mediaMap) {
      if (key !== 'count') {
        const mmap = mediaMap[key]
        media += ` ${key} {`
        for (const style in mmap) {
          if (style !== 'count' && style !== 'id') {
            if (style === 'state') {
              for (const id in mmap.state) {
                media += ` .${id} {${mmap.state[id]};}`
              }
            } else {
              media += ` .${mmap[style]} {${style};}`
            }
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
