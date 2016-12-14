const parent = require('../../render/dom/parent')
const Styletron = require('styletron')
const { injectStylePrefixed } = require('styletron-utils')
const styleSheet = document.head.appendChild(document.createElement('style'))
const styletron = new Styletron([styleSheet])
const ua = require('vigour-ua/navigator')

exports.props = {
  style: {
    type: 'group',
    render: {
      static (t, node, store) {
        node.className = injectStylePrefixed(styletron, store)
      },
      state (t, s, type, subs, tree, id, pid, store) {
        if (type !== 'remove') {
          const node = parent(tree, pid)
          if (node) {
            node.className = injectStylePrefixed(styletron, store)
          }
        }
      }
    },
    props: {
      inlineStyle: {
        type: 'property',
        props: { name: true },
        render: {
          static (target, node) {
            node.style[target.name || target.key] = target.compute()
          },
          state (t, s, type, subs, tree, id, pid) {
            if (type !== 'remove') {
              const node = parent(tree, pid)
              node.style[t.name || (t.key !== 'default' ? t.key : s.key)] = s
              ? t.compute(s, s)
              : t.compute()
            }
          }
        }
      }
    },
    inject: [
      require('./transform'),
      t => {
        const injectStyle = t.props.default
        const inlineStyle = t.props.inlineStyle
        t.set({
          props: {
            default: (t, val, key, stamp) => val && val.$
            ? inlineStyle(t, val, key, stamp)
            : injectStyle(t, val, key, stamp)
          }
        }, false)
        /* on IE 10 use msFlexOrder for inline order property */
        if (ua.browser === 'ie' && ua.version === 10) {
          t.set({
            props: {
              order: (t, val, key, stamp) => val && val.$
              ? inlineStyle(t, val, 'msFlexOrder', stamp)
              : injectStyle(t, val, key, stamp)
            }
          }, false)
        }
      }
    ]
  }
}
