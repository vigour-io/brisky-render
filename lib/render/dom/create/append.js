'use strict'
exports.static = function staticAppendNode (target, pnode, domNode) {
  // needs parent target else you dont know the context  and the relative idnex
  pnode.appendChild(domNode)
}

exports.state = function stateAppendNode (target, pnode, domNode, subs, tree, uid, order) {
  if (order !== void 0) {
    const last = pnode._last
    domNode._order = order
    if (order < last) {
      for (let c = pnode.childNodes, i = c.length - 1; i > -1; i--) {
        if (c[i]._order > order) {
          console.log('YO!', c[i], c[i]._order)
          if (i < 2 || c[i - 1]._order < order || !c[i - 1]._order) {
            pnode.insertBefore(domNode, c[i])
            return
          }
        }
      }
    }
    pnode._last = order
    pnode.appendChild(domNode)
  } else {
    pnode.appendChild(domNode)
  }
}
