'use strict'
require('html-element/global-shim')
const parseStatic = require('../../../static')
const fragment = require('./fragment')
const props = parseStatic.property
const elems = parseStatic.element
const tag = t => t.tag || t.inherits && tag(t.inherits)

exports.static = exports.state = renderElement
function renderElement (t, type, subs, tree, id, pnode) {
  const nodeType = tag(t)
  if (nodeType === 'fragment') {
    return fragment(t, pnode, id, tree)
  } else {
    const node = document.createElement(nodeType)
    props(t, node)
    elems(t, node)
    if (!t.isStatic) { tree._[id] = node }
    return node
  }
}
