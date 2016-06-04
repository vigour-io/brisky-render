'use strict'
exports.static = function staticAppendNode (target, pnode, domNode) {
  const index = target.findIndex(target.cParent())
  if (index !== void 0) {
    console.error(index)
    pnode._last = index
    domNode._order = index
  }
  pnode.appendChild(domNode)
}

exports.state = function stateAppendNode (target, pnode, domNode, subs, tree, uid, order) {
  if (order !== void 0) {
    const next = findNode(order, pnode)
    domNode._order = order
    if (next) {
      pnode.insertBefore(domNode, next)
    } else {
      pnode._last = order
      pnode.appendChild(domNode)
    }
  } else {
    pnode.appendChild(domNode)
  }
}

function findNode (order, pnode) {
  const last = pnode._last
  if (order < last) {
    // replace this with pivot finder (++ -- loop from piv)
    for (let c = pnode.childNodes, i = c.length - 1; i > -1; i--) {
      if (c[i]._order > order) {
        if (i < 2 || c[i - 1]._order < order || !c[i - 1]._order) {
          return c[i]
        }
      }
    }
  }
}
