import parent from '../../render/dom/parent'
import { appendUnit as unit } from './util'

const injectable = {}
const pxval = { type: 'px' }
const props = {}
const pxprops = [
  'minWidth',
  'width',
  'height',
  'left',
  'right',
  'bottom',
  'top',
  'margin',
  'padding'
]

export default injectable

for (let i = 0; i < pxprops.length; i++) {
  props[pxprops[i]] = pxval
}

injectable.types = {
  px: {
    type: 'style',
    render: {
      static (target, pnode) {
        pnode.style[target.key] = unit(target.compute(), 'px')
      },
      state (target, s, type, subs, tree, id, pid) {
        if (type !== 'remove') { // fix
          const pnode = parent(tree, pid)
          pnode.style[target.key] = unit(
            s ? target.compute(s, s) : target.compute(), 'px'
          )
        }
      }
    }
  }
}

injectable.props = props
