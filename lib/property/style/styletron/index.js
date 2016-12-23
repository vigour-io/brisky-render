import { get } from 'brisky-struct'
import styletronUtils from 'styletron-utils'
import styletron from './instance'

const { injectStylePrefixed } = styletronUtils

const isNotEmpty = store => {
  for (let i in store) {
    return true
  }
}

// no state yet (will come -- thats why group)
export default {
  type: 'group',
  render: {
    static (t, node, store) {
      if (!get(t._p._p, 'class')) {
        if (isNotEmpty(store)) node.className = injectStylePrefixed(styletron, store)
      } else {
        if (isNotEmpty(store)) {
          if (!('_className' in node)) {
            node._className = node.className || ''
          }
          const className = node._className
          const tron = injectStylePrefixed(styletron, store)
          // not the fastest -- but ok
          node.setAttribute('data-styletron', tron)
          node.className = className + tron
        } else if (node.getAttribute('data-styletron')) {
          node.removeAttribute('data-styletron')
        }
      }
    }
  }
}
