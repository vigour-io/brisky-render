import parent from '../../render/dom/parent'
import ua from 'vigour-ua/navigator'
import { property } from '../../render/static'
import { sheet } from './sheet'
import transform from './transform'

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
      default: (t, val, key, stamp) => {
        // inefficient check
        if (key === 'order' && ua.browser === 'ie' && ua.version === 10) {
          key = 'msFlexOrder'
        }
        if (val && val.$ || t.get([key, '$'])) { // not good enough // just add defaults -- also need to check inheritance
          console.log('add inline!')
          return inlineStyle(t, val, key, stamp)
        } else {
          console.log('add sheet!')
          t.set({ sheet: { [key]: val } }, stamp)
        }
      }
    }

    t.set({ props }, false)
  }
}

export default {
  types: { style, inlineStyle },
  props: { style: { type: 'style' } }
}
