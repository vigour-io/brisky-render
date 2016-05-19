'use strict'
require('html-element')
const parseStatic = require('../../../static')
const props = parseStatic.property
const elems = parseStatic.element
exports.static = exports.state = renderElement
function renderElement (target, type, stamp, subs, tree, id, pnode) {
  const node = document.createElement(target.tag)
  // console.log('doc-fragment -- does not work /w html-element (currently)')
  props(target, node)
  elems(target, node)
  if (!target.isStatic) { tree._[id] = node }
  return node
}
