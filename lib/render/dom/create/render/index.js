require('html-element/global-shim')
const { property, element } = require('../../../static')
const fragment = require('./fragment')
const tag = t => t.tag || t.inherits && tag(t.inherits)

exports.state = (t, type, subs, tree, id, pnode) => {
  const nodeType = tag(t)
  if (nodeType === 'fragment') {
    return fragment(t, pnode, id, tree)
  } else {
    const node = document.createElement(nodeType)
    property(t, node)
    element(t, node)
    tree._[id] = node
    return node
  }
}

exports.static = t => {
  const nodeType = tag(t)
  const node = document.createElement(nodeType)
  property(t, node)
  element(t, node)
  return node
}
