'use strict'
const parseStatic = require('../../../static')
// const props = parseStatic.property
const elems = parseStatic.element

module.exports = function (target, pnode, id, tree) {
  const arr = [ pnode ]
  elems(target, arr)
  tree._[id] = arr
  return arr
}
