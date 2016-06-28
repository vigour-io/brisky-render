'use strict'
require('html-element')
const parseStatic = require('../../../static')
const fragment = require('./fragment')

// addParentNode(
//   global.Element,
//   global.Text,
//   global.Node
// )
// function addParentNode () {
//   for (var i in arguments) {
//     Object.defineProperty(arguments[i].prototype, 'parentNode', {
//       get () { return this.parentElement }
//     })
//   }
// }

const props = parseStatic.property
const elems = parseStatic.element
exports.static = exports.state = renderElement
function renderElement (target, type, stamp, subs, tree, id, pnode) {
  const nodeType = target.tag
  if (nodeType === 'fragment') {
    return fragment(target, pnode, id, tree)
  } else {
    const node = document.createElement(nodeType)
    props(target, node)
    elems(target, node)
    if (!target.isStatic) { tree._[id] = node }
    return node
  }
}
