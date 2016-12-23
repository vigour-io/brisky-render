import parent from '../../render/dom/parent'
import ua from 'vigour-ua/navigator'
import { property } from '../../render/static'
import styletron from './styletron'
import transform from './transform'

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
    styletron,
    transform,
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
  inject: t => {
    const inlineStyle = t.props.inlineStyle

    t.set({
      props: {
        default: (t, val, key, stamp) => {
          if (val && val.$) {
            return inlineStyle(t, val, key, stamp)
          } else {
            t.set({ styletron: { [key]: val } }, stamp)
          }
        }
      }
    }, false)

    /* on IE 10 use msFlexOrder for inline order property */
    if (ua.browser === 'ie' && ua.version === 10) {
      t.set({
        order: (t, val, key, stamp) => {
          if (val && val.$) {
            return inlineStyle(t, val, 'msFlexOrder', stamp)
          } else {
            t.set({ styletron: { order: val } }, stamp)
          }
        }
      }, false)
    }
  }
}

export default {
  types: { style },
  props: { style: { type: 'style' } }
}
