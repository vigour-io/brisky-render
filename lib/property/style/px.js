'use strict'
const getParent = require('brisky-core/lib/render/dom/parent')
const unit = require('./util').appendUnit
const pxval = { type: 'px' }
const properties = {}
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
  properties[pxprops[i]] = pxval
}

exports.types = {
  px: {
    type: 'style',
    render: {
      static (target, pnode) {
        pnode.style[target.key] = unit(target.compute(), 'px')
      },
      state (target, _state, type, stamp, subs, tree, id, pid) {
        if (type !== 'remove') { // fix
          const pnode = getParent(type, stamp, subs, tree, pid) // fix
          pnode.style[target.key] = unit(
            _state // fix
              ? target.compute(_state)
              : target.compute(), 'px'
          )
        }
      }
    }
  }
}

exports.properties = properties
