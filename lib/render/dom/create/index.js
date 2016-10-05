'use strict'
const render = require('./render')
const renderStatic = render.static
const renderState = render.state
const getParent = require('../parent')
const append = require('./append')
const appendStatic = append.static
const appendState = append.state
const isFragment = require('../../fragment').isFragment

exports.static = function createElementStatic (target, pnode) {
  const node = renderStatic(target)
  appendStatic(target, pnode, node)
  if (target.hasEvents) { node._ = target }
  return node
}

exports.state = function createElementState (target, state, type, stamp, subs, tree, id, pid, order) {
  const pnode = getParent(type, stamp, subs, tree, pid)
  const node = renderState(target, type, stamp, subs, tree, id, pnode)
  if (pnode) {
    if (target.tag !== 'fragment') {
      appendState(target, pnode, node, subs, tree, id, order)
    } else {
      if (isFragment(pnode)) {
        pnode.push(node)
      }
    }
  } else {
    console.error('no pnode', target.inspect())
  }
  return node
}
