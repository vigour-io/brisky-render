'use strict'
const fragment = require('../../fragment')
const findParent = fragment.findParent
const isFragment = fragment.isFragment

exports.static = function staticAppendNode (target, pnode, domNode) {
  if (isFragment(pnode)) {
    pnode.push(domNode)
    pnode = findParent(pnode)
  }
  const index = target.findIndex(target.cParent())
  if (index !== void 0) {
    pnode._last = index
    domNode._order = index
  }
  pnode.appendChild(domNode)
}

exports.state = function stateAppendNode (target, pnode, domNode, subs, tree, uid, order) {
  var fragment
  if (isFragment(pnode)) {
    fragment = pnode
    pnode = findParent(pnode)
  }
  if (order !== void 0) {
    const next = findNode(order, pnode)
    domNode._order = order
    if (next) {
      if (fragment) { fragment.push(domNode) }
      pnode.insertBefore(domNode, next)
    } else {
      pnode._last = order
      if (fragment) { fragment.push(domNode) }
      pnode.appendChild(domNode)
    }
  } else {
    if (fragment) { fragment.push(domNode) }

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
