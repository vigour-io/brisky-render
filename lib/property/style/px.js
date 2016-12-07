const getParent = require('../../render/dom/parent')
const unit = require('./util').appendUnit
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

for (let i = 0; i < pxprops.length; i++) {
  props[pxprops[i]] = pxval
}

exports.types = {
  px: {
    type: 'style',
    render: {
      static (target, pnode) {
        pnode.style[target.key] = unit(target.compute(), 'px')
      },
      state (target, s, type, subs, tree, id, pid) {
        if (type !== 'remove') { // fix
          const pnode = getParent(tree, pid)
          pnode.style[target.key] = unit(
            s ? target.compute(s, s) : target.compute(), 'px'
          )
        }
      }
    }
  }
}

exports.props = props
