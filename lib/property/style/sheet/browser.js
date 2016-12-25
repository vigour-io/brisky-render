const isNotEmpty = store => {
  for (let i in store) {
    return true
  }
}

const createStyleSheet = (t) => {
  t.set({
    stylesheet: {
      sheet:
      '',
      media: '',
      map: {},
      count: 0
    }
  }, false)
  return t.stylesheet
}

const uid = num => {
  // var mod = num % 26
  // var pow = num / 26 | 0
  // need to count higer
  return String.fromCharCode(97 + num)
}

const setStyle = (t, store) => {
  var className = ''
  var style
  var last
  while (t && !style) {
    style = t.stylesheet
    if (!style) {
      last = t
      t = t.parent()
    }
  }
  if (style === void 0) {
    style = createStyleSheet(last)
  }
  const map = style.map
  for (let key in store) {
    let s = key + ':' + store[key]
    if (!map[s]) {
      const rule = uid(style.count++)
      map[s] = rule
      style.sheet += `\n .${rule} { ${s}; }`
    }
    className += ' ' + map[s]
  }
  return className
}

const getClass = t => t.class !== void 0
  ? t.class
  : t.inherits && getClass(t.inherits)

// no state yet (will come -- thats why group)

const sheet = {
  type: 'group',
  render: {
    state: () => {
      // console.log('???')
    },
    static (t, node, store) {
      // dont have tree of course...
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

const stylesheet = true

export { sheet, stylesheet }
