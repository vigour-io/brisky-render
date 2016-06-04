'use strict'
const parseStatic = require('../../../static')
const props = parseStatic.property
const elems = parseStatic.element
const fragment = require('./fragment')

exports.static = function renderElementStatic (target) {
  var node
  if (target.isStatic === true && target._cachedNode) {
    node = target._cachedNode.cloneNode(true)
    if (target._cachedNode._index) {
      node._index = target._cachedNode._index
    }
  } else {
    if (target._cachedNode) {
      node = target._cachedNode.cloneNode(false)
      if (target._cachedNode._propsStaticParsed) {
        node._propsStaticParsed = true
      }
    } else {
      const nodeType = target.tag
      if (nodeType === 'fragment') {
        node = document.createDocumentFragment()
        props(target, node)
        elems(target, node)
        console.warn('lets add this static fragment')
        target._cachedNode = node
        return node.cloneNode(true)
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

exports.state = function renderElement (target, type, stamp, subs, tree, id, pnode) {
  var node
  // this copies unwanted styles / props -- need to add an extra clonenode for this
  if (target._cachedNode) {
    node = target._cachedNode.cloneNode(false)
    tree._[id] = node
    if (target._cachedNode._last) {
      node._last = target._cachedNode._last
    }
  } else {
    const nodeType = target.tag
    if (nodeType === 'fragment') {
      return fragment(target, pnode, id, tree)
    } else {
      node = document.createElement(nodeType)
      if (props(target, node)) {
        target._cachedNode = node
      }
    }
    tree._[id] = node
  }
  elems(target, node)
  return node
}
