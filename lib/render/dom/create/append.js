'use strict'
exports.static = function staticAppendNode (target, pnode, domNode) {
  pnode.appendChild(domNode)
}

exports.state = function stateAppendNode (target, pnode, domNode, subs, tree, uid) {
  pnode.appendChild(domNode)
}
