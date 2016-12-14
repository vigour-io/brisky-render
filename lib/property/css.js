const { injectStylePrefixed } = require('styletron-utils')
const Styletron = require('styletron')
const styleSheet = document.head.appendChild(document.createElement('style'))
const styletron = new Styletron([styleSheet])
const parent = require('../render/dom/parent')

exports.props = {
  css: {
    type: 'group',
    render: {
      static (t, node, store) {
        setClassName(injectStylePrefixed(styletron, store), node)
      },
      state (t, s, type, subs, tree, id, pid, store) {
        const node = parent(tree, pid)
        if (node) {
          setClassName(injectStylePrefixed(styletron, store), node)
        }
      }
    }
  }
}

function setClassName (val, node) {
  if (val) {
    node.className = val
  } else if ('className' in node) {
    node.removeAttribute('class')
  }
}
