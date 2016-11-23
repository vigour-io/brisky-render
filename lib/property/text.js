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
      static (t, pnode) {
        appendStatic(t, pnode, document.createTextNode(t.compute()))
      },
      state  (t, s, type, subs, tree, id, pid, order) {
        var node = tree._[id]
        const val = t.compute(s.compute()) // do this by default....
        console.log('go go go', val, node, pid)

        var pnode
        if (!node) {
          if (typeof val !== 'object' && val !== void 0) {
            pnode = getParent(type, subs, tree, pid)

            node = tree._[id] = document.createTextNode(val)
            appendState(t, pnode, node, subs, tree, id, order)
          }
        } else {
          if (type && type === 'remove' || (typeof val === 'object' && val !== void 0)) {
            pnode = getParent(type, subs, tree, pid) || node.parentNode
            if (pnode) { pnode.removeChild(node) }
          } else {
            // const val = t.compute((s.compute())
            if (val && typeof val !== 'object' || val === 0) {
              node.nodeValue = val
            }
          }
        }
      }
    }
  }
}

exports.props = { text: { type: 'text' } }
