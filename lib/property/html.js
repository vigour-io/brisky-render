'use strict'
const getParent = require('../render/dom/parent')

exports.properties = {
  html: {
    type: 'property',
    render: {
      static (target, node) {
        node.innerHTML = target.compute()
      },
      state  (target, state, type, stamp, subs, tree, id, pid) {
        var node = getParent(type, stamp, subs, tree, pid)
        if (type === 'remove') {
          let val = target.compute()
          node.innerHTML = val !== target ? val : ''
        } else {
          node.innerHTML = target.compute(state.val || state)
        }
      }
    }
  }
}
