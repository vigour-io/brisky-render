'use strict'
const render = require('./render')
const renderStatic = render.static
const renderState = render.state
const getParent = require('../parent')
const append = require('./append')
const appendStatic = append.static
const appendState = append.state

exports.static = function createElementStatic (target, pnode) {
  const domNode = renderStatic(target)
  appendStatic(target, pnode, domNode)
  if (target.hasEvents) { domNode._ = target }
  return domNode
}

exports.state = function createElementState (target, state, type, stamp, subs, tree, id, pid, order) {
  const pnode = getParent(type, stamp, subs, tree, pid)
  const domNode = renderState(target, type, stamp, subs, tree, id, pnode)
  if (pnode) {
    if (target.tag !== 'fragment') {
      appendState(target, pnode, domNode, subs, tree, id, order)
    } else {
      console.log('fraggggg', pnode)
    }
  }
  if (target.hasEvents) {
    if (state) {
      domNode._sc = state.storeContext()
      domNode._s = state
    }
    domNode._ = target
  }
  return domNode
}
