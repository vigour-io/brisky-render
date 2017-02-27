import { findParent, isFragment } from '../../fragment'

const injectable = {}

export default injectable

injectable.static = (t, pnode, domNode) => {
  if (isFragment(pnode)) {
    pnode.push(domNode)
    pnode = findParent(pnode)
  }
  const index = t.findIndex(t.parent())
  if (index !== void 0) {
    pnode._last = index
    domNode._order = index
  }
  pnode.appendChild(domNode)
}

injectable.state = (t, pnode, node, subs, tree, uid, order) => {
  var fragment
  if (isFragment(pnode)) {
    fragment = pnode
    pnode = findParent(pnode)
  }
  if (order !== void 0) {
    const next = findNode(order, pnode)
    node._order = order
    // console.log(next, order)
    if (next) {
      if (fragment) { fragment.push(node) }
      pnode.insertBefore(node, next)
    } else {
      pnode._last = order
      if (fragment) { fragment.push(node) }
      pnode.appendChild(node)
    }
  } else {
    if (fragment) { fragment.push(node) }
    pnode.appendChild(node)
  }
}

function findNode (order, pnode) {
  const last = pnode._last
  if (order < last) {
    const c = pnode.childNodes
    let i = c.length
    while (i--) {
      if (c[i] && c[i]._order > order && (!c[i - 1] || c[i - 1]._order <= order)) {
        return c[i]
      }
    }
  }
}
