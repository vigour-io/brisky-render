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
      state  (target, state, type, stamp, subs, tree, id, pid) {
        var node = tree._[id]
        var pnode
        if (!node) {
          pnode = getParent(type, stamp, subs, tree, pid)
          // has to be compute make it fast
          node = tree._[id] = document.createTextNode(target.compute(state))
          appendState(target, pnode, node, subs, tree, id)
        } else {
          // node
          if (type && type === 'remove') {
            // rather call parentNode but crashes in node
            pnode = getParent(type, stamp, subs, tree, pid) || node.parentNode
            pnode.removeChild(node)
          } else {
            // has to be compute make it fast -- its ultra slow now!
            // easpecially creating the operator keys rly need to optmize
            node.nodeValue = target.compute(state.val)
          }
        }
      }
    }
  }
}

exports.properties = { text: { type: 'text' } }
