'use strict'
exports.static = function staticAppendNode (target, pnode, domNode) {
  // needs parent target else you dont know the context  and the relative idnex
  pnode.appendChild(domNode)
}

exports.state = function stateAppendNode (target, pnode, domNode, subs, tree, uid) {
  console.log('yo yo yo')
  pnode.appendChild(domNode)
}
