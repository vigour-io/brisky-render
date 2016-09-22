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

if (!console.group) {
  console.group = console.groupEnd = () => {
    console.log('--------------------')
  }
}

exports.state = function createElementState (target, state, type, stamp, subs, tree, id, pid, order) {

  // console.group()
  // console.log('get parent')
  const pnode = getParent(type, stamp, subs, tree, pid)
  const node = renderState(target, type, stamp, subs, tree, id, pnode)

  if (!pnode && target.parent) {
    console.error('cant find parent something must be wrong...')
    // console.error('this is whats up', state.path(), target.path(), node)
  }
  // console.groupEnd()
  // console.error(node, pnode, pid, tree, subs)

  if (pnode) {
    if (target.tag !== 'fragment') {
      appendState(target, pnode, node, subs, tree, id, order)
    } else {
      if (isFragment(pnode)) {
        pnode.push(node)
      }
    }
  }
  return node
}
