require('html-element/global-shim')
const { property, element, isStatic } = require('../../../static')
const fragment = require('./fragment')
const tag = t => t.tag || t.inherits && tag(t.inherits)

exports.static = exports.state = (t, type, subs, tree, id, pnode) => {
  const nodeType = tag(t)
  if (nodeType === 'fragment') {
    return fragment(t, pnode, id, tree)
  } else {
    const node = document.createElement(nodeType)
    property(t, node)
    element(t, node)
    if (!isStatic(t)) { tree._[id] = node }
    return node
  }
}
