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
        var pnode
        if (!node) {
          pnode = getParent(type, stamp, subs, tree, pid)
          node = tree._[id] = document.createTextNode(target.compute(state))
          appendState(target, pnode, node, subs, tree, id, order)
        } else {
          if (type && type === 'remove') {
            pnode = getParent(type, stamp, subs, tree, pid) || node.parentNode
            if (pnode) { pnode.removeChild(node) }
          } else {
            node.nodeValue = target.compute(state)
          }
        }
      }
    }
  }
}

exports.properties = { text: { type: 'text' } }
