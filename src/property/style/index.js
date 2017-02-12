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
    inlineStyle
  },
  inject: t => {
    const inlineStyle = t.props.inlineStyle
    const props = {
      default (t, val, key, stamp) {
        if (key in prefix) {
          key = prefix[key]
        }
        if (val && val.$ || t.get([key, '$'])) {
          return inlineStyle(t, val, key, stamp)
        } else {
          t.set({ sheet: { [key]: val } }, stamp)
        }
      }
    }
    t.set({ props }, false)
  }
}

for (let field in prefixVal) {
  style.props[field] = {
    type: 'inlineStyle',
    render: {
      static (target, node) {
        node.style[target.name || target.key] = prefixVal[field](target.compute())
      },
      state (t, s, type, subs, tree, id, pid) {
        if (type !== 'remove') {
          const node = parent(tree, pid)
          node.style[t.name || (t.key !== 'default' ? t.key : s.key)] = prefixVal[field](
            s ? t.compute(s, s) : t.compute()
          )
        }
      }
    }
  }
}

export default {
  types: { inlineStyle, style },
  props: { style: { type: 'style' } }
}
