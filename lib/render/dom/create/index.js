const render = require('./render')
const renderStatic = render.static
const renderState = render.state
const getParent = require('../parent')
const append = require('./append')
const appendStatic = append.static
const appendState = append.state
const isFragment = require('../../fragment').isFragment

exports.static = (t, pnode) => {
  const node = renderStatic(t)
  appendStatic(t, pnode, node)
  if (t.hasEvents) { node._ = t }
  return node
}

exports.state = (t, state, type, subs, tree, id, pid, order) => {
  const pnode = getParent(type, subs, tree, pid)
  const node = renderState(t, type, subs, tree, id, pnode)
  if (pnode) {
    if (t.tag !== 'fragment') {
      appendState(t, pnode, node, subs, tree, id, order)
    } else {
      if (isFragment(pnode)) {
        pnode.push(node)
      }
    }
  }
  return node
}
