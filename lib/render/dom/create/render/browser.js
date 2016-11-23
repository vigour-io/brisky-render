'use strict'
const parseStatic = require('../../../static')
const props = parseStatic.property
const elems = parseStatic.element
const fragment = require('./fragment')

exports.static = function renderElementStatic (target) {
  // make a cloneNode shim...
  var node
  if (target.isStatic === true && target._cachedNode && target.hasOwnProperty('_cachedNode')) {
    node = target._cachedNode.cloneNode(true)
    if (target._cachedNode._index) {
      node._index = target._cachedNode._index
    }
    if (target._cachedNode._last) {
      node._last = target._cachedNode._last
    }
  } else {
    if (target._cachedNode && target.hasOwnProperty('_cachedNode')) {
      node = target._cachedNode.cloneNode(false)
      if (target._cachedNode._propsStaticParsed) {
        node._propsStaticParsed = true
      }
    } else {
      const nodeType = target.get('tag')
      if (nodeType === 'fragment') {
        console.error('not handeling static fragments yet')
      } else {
        node = document.createElement(nodeType)
        props(target, node)
        target._cachedNode = node
      }
    }
    elems(target, node)
  }
  return node
}

exports.state = function renderElement (target, type, subs, tree, id, pnode) {
  var node
  // @todo: this copies unwanted styles / props -- need to add an extra clonenode for this
  if (target._cachedNode) {
    node = target._cachedNode.cloneNode(false)
    tree._[id] = node
    if (target._cachedNode._last) {
      node._last = target._cachedNode._last
    }
    if (target._cachedNode._index) {
      node._index = target._cachedNode._index
    }
  } else {
    const nodeType = target.get('tag')
    if (nodeType === 'fragment') {
      return fragment(target, pnode, id, tree)
    } else {
      node = document.createElement(nodeType)
      const staticProps = target.keys('staticProps')
      if (staticProps) {
        target._cachedNode = node
        props(target, node)
        if (hasStateProperties(target)) {
          node = target._cachedNode.cloneNode(false)
        }
      }
    }
    tree._[id] = node
  }
  elems(target, node)
  return node
}

function hasStateProperties (target) {
  const keys = target.keys()
  const len = keys.length

  console.log(keys)
  for (let i = 0; i < len; i++) {
    let check = target[keys[i]]
    if (!check.isElement && !check.isStatic) {
      return true
    }
  }
}
