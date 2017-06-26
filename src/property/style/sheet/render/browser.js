import getNode from './node'

const parseStyle = (style, target) => {
  for (let rule in style.sheet.cssRules) {
    const cssRule = style.sheet.cssRules[rule]
    if (cssRule.selectorText) {
      let body = cssRule.cssText.match(/.+\{ (.+) \}/)
      let key = cssRule.selectorText.slice(1)
      if (body && body[1]) {
        body = body[1].replace(': ', ':').slice(0, -1)
        if (/:0px/.test(body)) body = body.replace(/:0px/g, ':0')
        target.globalSheet.map[body] = key
        target.map[body] = key
      }
      target.globalSheet.count++
    } else if (cssRule.media) {
      let media = '@media ' + cssRule.conditionText
      if (!target.mediaMap[media]) {
        target.mediaMap[media] = {
          id: ++target.mediaMap.count, count: 0, state: {}
        }
      }
      for (let rule in cssRule.cssRules) {
        if (cssRule.cssRules[rule].selectorText) {
          let body = cssRule.cssRules[rule].cssText.match(/.+\{ (.+) \}/)
          let key = cssRule.cssRules[rule].selectorText.slice(1)
          if (body && body[1]) {
            body = body[1].replace(': ', ':').slice(0, -1)
            if (/:0px/.test(body)) body = body.replace(/:0px/g, ':0')
            target.mediaMap[media][body] = key
          }
        }
      }
    }
  }
}

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
    var media = ''
    var str = ''
    for (const i in this.map) {
      str += ` .${this.map[i]} {${i};}`
    }
    const mediaMap = this.mediaMap
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
  update (rules, map) {
    if (this.parsed) {
      if (!rules) {
        this.parsed.innerHTML = this.parse()
      } else {
        let i = rules.length
        const sheet = this.parsed.sheet
        if (sheet.addRule) {
          while (i--) {
            sheet.addRule('.' + map[rules[i]], rules[i])
          }
        } else {
          while (i--) {
            sheet.insertRule('.' + map[rules[i]] + '{' + rules[i] + '}', i) // fallback for FF
          }
        }
      }
    }
  }
}
