import getNode from './node'

const parseStyle = (style, target) => {
  for (let rule in style.sheet.cssRules) {
    if (style.sheet.cssRules[rule].selectorText) {
      let body = style.sheet.cssRules[rule].cssText.match(/.+\{ (.+) \}/)
      let key = style.sheet.cssRules[rule].selectorText.slice(1)
      if (body && body[1]) {
        body = body[1].replace(': ', ':').slice(0, -1)
        if (/:0px/.test(body)) body = body.replace(/:0px/g, ':0')
        target.globalSheet.map[body] = key
        target.map[body] = key
      }
      target.globalSheet.count++
    }
  }
}

// stylesheet.cssRules[0].style.backgroundColor="blue";
// stylesheet.insertRule(rule,index) (for update)

export default class StyleSheet {
  constructor (t, globalSheet) {
    this.map = {}
    this.globalSheet = globalSheet
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
      var style
      node = getNode(node)
      if (resolve) {
        const children = node.children
        let i = children.length
        while (i--) {
          if (children[i].getAttribute && children[i].getAttribute('data-style')) {
            style = children[i]
            parseStyle(style, this)
            break
          }
        }
      }
      if (!style) {
        style = document.createElement('style')
        style.setAttribute('data-style', true)
        style.innerHTML = this.parse()
        node.appendChild(style)
      }
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
