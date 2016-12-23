import styletronUtils from 'styletron-utils'
import styletron from './instance'

const { injectStylePrefixed } = styletronUtils

const isNotEmpty = store => {
  for (let i in store) {
    return true
  }
}

const getClass = t => t.class !== void 0
  ? t.class
  : t.inherits && getClass(t.inherits)

// no state yet (will come -- thats why group)
export default {
  type: 'group',
  render: {
    static (t, node, store) {
      if (!getClass(t._p._p)) {
        if (isNotEmpty(store)) node.className = injectStylePrefixed(styletron, store)
      } else {
        const style = node.getAttribute('data-styletron')
        if (isNotEmpty(store)) {
          const newStyle = injectStylePrefixed(styletron, store)
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
