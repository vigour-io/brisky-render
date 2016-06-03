'use strict'
exports.static = function staticAppendNode (target, pnode, domNode) {
  // needs parent target else you dont know the context  and the relative idnex
  pnode.appendChild(domNode)
}

exports.state = function stateAppendNode (target, pnode, domNode, subs, tree, uid, order) {
  if (order !== void 0) {
    const pOrder = pnode._order
    domNode.order = order
    if (order < pOrder) {
      for (let c = domNode.childNodes, i = c.length - 1; i > -1; i--) {
        if (c[i].order > order) {
          if (i > 1) {

          } else {
            pnode.insertBefore(domNode, c[i])
          }
        }
      }
    } else {
      pnode._order = order
      pnode.appendChild(domNode)
    }
  } else {
    pnode.appendChild(domNode)
  }
}
