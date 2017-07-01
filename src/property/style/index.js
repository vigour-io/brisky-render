import parent from '../../render/dom/parent'
import { property } from '../../render/static'
import { s } from './sheet'
import transform from './transform'
import prefix from './prefix'
import prefixVal from './prefix/value'
import { set, compute } from 'brisky-struct'
import nidium from './nidium'

const isNidium = global.__nidium__

var module

if (isNidium) {
  module = nidium
} else {
  const inlineStyle = {
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
        ? compute(t, s, s, tree)
        : compute(t)
        }
      }
    }
  }

  const prefixInlineStyle = {
    type: 'inlineStyle',
    render: {
      static (target, node) {
        const field = target.name || target.key
        node.style[field] = prefixVal[field](target.compute())
      },
      state (t, s, type, subs, tree, id, pid) {
        if (type !== 'remove') {
          const node = parent(tree, pid)
          const field = t.name || (t.key !== 'default' ? t.key : s.key)
          node.style[field] = prefixVal[field](s ? t.compute(s, s) : t.compute())
        }
      }
    }
  }

  const style = {
    type: 'property',
    render: {
      static: property,
      state (t, s, type, subs, tree, id, pid) {
        if (type !== 'remove') {
          const pnode = parent(tree, pid)
          if (!pnode._styleStaticParsed) {
            property(t, pnode)
            pnode._styleStaticParsed = true
          }
        }
      }
    },
    props: {
      transform,
      inlineStyle,
      prefixInlineStyle,
      sheet: (t, val) => {
        t.parent().set({ sheet: val })
      }
    },
    inject: t => {
      const inlineStyle = t.props.inlineStyle
      const prefixInlineStyle = t.props.prefixInlineStyle
      const props = {
        default (t, val, key, stamp) {
          if (key in prefix) {
            key = prefix[key]
          }
          if (val && val.$ || t.get([key, '$'])) {
            if (prefixVal[key]) {
              return prefixInlineStyle(t, val, key, stamp)
            } else {
              return inlineStyle(t, val, key, stamp)
            }
          } else {
            set(t.parent(), { sheet: { [key]: val } })
          }
        }
      }
      set(t, { props })
    }
  }

  module = {
    types: { inlineStyle, style },
    props: {
      style: { type: 'style' },
      sheet: {
        type: 'property',
        props: {
          default: {type: 'struct'}
        },
        render: {
          state: () => {},
          static: (t, node) => {
            s(t, node)
          }
        }
      }
    }
  }
}

export default module
