const isNotEmpty = store => {
  for (let i in store) {
    return true
  }
}

const createStyleSheet = (t) => {
  const style = document.createElement('style')
  style.appendChild(document.createTextNode('')) // webkit hack
  // node.appendChild(style)
  document.head.appendChild(style) // (has to be removed)
  // node._style = style // do with data element for server -- this is not good yet
  return style
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
    style = t.stylesheet && t.stylesheet.val
    if (!style) {
      last = t
      t = t.parent()
    }
  }
  if (!style) {
    style = createStyleSheet(last)
    style.cache = { map: {}, count: 0 }
  }
  const cache = style.cache
  const map = cache.map
  const sheet = style.sheet
  for (let key in store) {
    let s = key + ':' + store[key]
    if (!map[s]) {
      const rule = uid(cache.count++)
      map[s] = rule
      sheet.insertRule(`.${rule} { ${s}; }`)
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

const stylesheet = {
  type: 'property',
  render: {
    static: (t, node, store) => {

    },
    state: () => {

    }
  }
}

export { sheet, stylesheet }
