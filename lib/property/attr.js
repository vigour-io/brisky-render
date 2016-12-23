import parent from '../render/dom/parent'
import { property } from '../render/static'

const injectable = {}

export default injectable

injectable.props = {
  attr: {
    type: 'property',
    render: {
      static: property,
      state (t, state, type, subs, tree, id, pid) {
        const pnode = parent(tree, pid)
        if (pnode && !pnode._propsStaticParsed) {
          property(t, pnode)
          pnode._propsStaticParsed = true
        }
      }
    },
    props: {
      type: null,
      default: {
        props: { name: true },
        render: {
          static (t, pnode) {
            const val = t.compute()
            if (val === t || val === void 0) {
              pnode.removeAttribute(t.name || t.key)
            } else {
              pnode.setAttribute(t.name || t.key, val)
            }
          },
          state (t, state, type, subs, tree, id, pid) {
            const pnode = parent(tree, pid)
            const key = t.name || t.key
            if (type === 'remove') {
              if (pnode) {
                pnode.removeAttribute(key)
              }
            } else {
              let val = t.compute(state)
              const type = typeof val
              if (type === 'boolean') { val = val + '' }
              if ((type === 'object' && val.inherits) || val === void 0) {
                if (pnode.getAttribute(key)) {
                  pnode.removeAttribute(key) // missing
                }
              } else {
                if (pnode.getAttribute(key) != val) { // eslint-disable-line
                  pnode.setAttribute(key, val)
                }
              }
            }
          }
        }
      },
      value: {
        render: {
          static (t, pnode) {
            const val = t.compute() // missing
            pnode.value = val // missing (needs a way on server this does not work)
          },
          state (t, state, type, subs, tree, id, pid) {
            const pnode = parent(tree, pid)
            if (type === 'remove') {
              if (pnode) { pnode.value = '' } // missing
            } else {
              const val = t.compute(state)
              if (val != pnode.value) { // eslint-disable-line
                pnode.value = val === t ? '' : val
              }
            }
          }
        }
      }
    }
  }
}
