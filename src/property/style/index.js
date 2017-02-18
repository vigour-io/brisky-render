import parent from '../../render/dom/parent'
import { property } from '../../render/static'
import { sheet } from './sheet'
import transform from './transform'
import prefix from './prefix'
import prefixVal from './prefix/value'

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
        ? t.compute(s, s)
        : t.compute()
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
        node.style[field] = prefixVal[field](s ? t.compute(s, s) : t.compute()
        )
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
    sheet,
    transform,
    inlineStyle,
    prefixInlineStyle
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
          t.set({ sheet: { [key]: val } }, stamp)
        }
      }
    }
    t.set({ props }, false)
  }
}

export default {
  types: { inlineStyle, style },
  props: { style: { type: 'style' } }
}
