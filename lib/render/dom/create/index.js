'use strict'
const render = require('./render')
const renderStatic = render.static
const renderState = render.state
const getParent = require('../parent')
const append = require('./append')
const appendStatic = append.static
const appendState = append.state

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
    }
  }
  if (target.hasEvents) {
    // have ot handle in -core
    // hasEvents wil just be labbeled as traveler allways
    if (state) {
      console.log('yo what up')
      node._sc = state.storeContext() // has to change today -- get rid of this piece of dirt
      // if (state._sc)
      console.log('yo what up')
      // when context need to do quite some special stuff -- on no context also needs to clear it on the state
      node._s = state
    }
    node._ = target
  }
  return node
}
