'use strict'
exports.static = function staticAppendNode (target, pnode, domNode) {
  const index = target.findIndex(target.cParent())
  if (index !== void 0) {
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
    for (let c = pnode.childNodes, len = c.length, i = 0; i < len; i++) {
      if (c[i] && c[i]._order > order) {
        if (i < 2 || (c[i - 1] && (c[i - 1]._order < order || !c[i - 1]._order))) {
          return c[i]
        }
      }
    }
  }
}
