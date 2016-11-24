'use strict'
const parseStatic = require('../../../static')
const props = parseStatic.property
const elems = parseStatic.element
const fragment = require('./fragment')
const get = require('brisky-struct/lib/get').get

const tag = t => t.tag || t.inherits && tag(t.inherits)

exports.static = function renderElementStatic (t) {
  // make a cloneNode shim...
  var node
  if (t.isStatic === true && t._cachedNode && t.hasOwnProperty('_cachedNode')) {
    node = t._cachedNode.cloneNode(true)
    if (t._cachedNode._index) {
      node._index = t._cachedNode._index
    }
    if (t._cachedNode._last) {
      node._last = t._cachedNode._last
    }
  } else {
    if (t._cachedNode && t.hasOwnProperty('_cachedNode')) {
      node = t._cachedNode.cloneNode(false)
      if (t._cachedNode._propsStaticParsed) {
        node._propsStaticParsed = true
      }
    } else {
      const nodeType = tag(t)
      if (nodeType === 'fragment') {
        console.error('not handeling static fragments yet')
      } else {
        node = document.createElement(nodeType)
        props(t, node)
        t._cachedNode = node
      }
    }
    elems(t, node)
  }
  return node
}

exports.state = function renderElement (t, type, subs, tree, id, pnode) {
  var node
  // @todo: this copies unwanted styles / props -- need to add an extra clonenode for this
  if (t._cachedNode) {
    node = t._cachedNode.cloneNode(false)
    tree._[id] = node
    if (t._cachedNode._last) {
      node._last = t._cachedNode._last
    }
    if (t._cachedNode._index) {
      node._index = t._cachedNode._index
    }
  } else {
    const nodeType = tag(t)
    if (nodeType === 'fragment') {
      return fragment(t, pnode, id, tree)
    } else {
      node = document.createElement(nodeType)
      const staticProps = t.keys('staticProps')
      if (staticProps) {
        t._cachedNode = node
        props(t, node)
        if (hasStateProperties(t)) {
          node = t._cachedNode.cloneNode(false)
        }
      }
    }
    tree._[id] = node
  }
  elems(t, node)
  return node
}

function hasStateProperties (t) {
  const keys = t.keys()
  if (keys) {
    let i = keys.length
    while (i--) {
      let check = get(t, keys[i])
      if (!check.isElement && !get(check, 'isStatic')) {
        return true
      }
    }
  }
}
