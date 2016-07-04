'use strict'
const getParent = require('../render/dom/parent')
const append = require('../render/dom/create/append')
const appendStatic = append.static
const appendState = append.state

exports.types = {
  text: {
    class: null,
    subscriptionType: true,
    render: {
      static (target, pnode) {
        appendStatic(target, pnode, document.createTextNode(target.compute()))
      },
      state  (target, state, type, stamp, subs, tree, id, pid, order) {
        var node = tree._[id]
        const val = target.compute(state)
        var pnode
        if (!node) {
          if (typeof val !== 'object' && val !== void 0) {
            pnode = getParent(type, stamp, subs, tree, pid)
            node = tree._[id] = document.createTextNode(val)
            appendState(target, pnode, node, subs, tree, id, order)
          }
        } else {
          if (type && type === 'remove' || (typeof val === 'object' && val !== void 0)) {
            pnode = getParent(type, stamp, subs, tree, pid) || node.parentNode
            if (pnode) { pnode.removeChild(node) }
          } else {
            const val = target.compute(state)
            if (val && typeof val !== 'object') {
              node.nodeValue = val
            }
          }
        }
      }
    }
  }
}

exports.properties = { text: { type: 'text' } }
