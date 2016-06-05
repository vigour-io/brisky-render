'use strict'
const parseStatic = require('../../../static')
// const props = parseStatic.property
const elems = parseStatic.element

module.exports = function (target, pnode, id, tree) {
  const slen = pnode.childNodes.length
  const arr = [ pnode ]
  elems(target, pnode)
  // props(target, pnode)
  for (let i = slen, len = pnode.childNodes.length; i < len; i++) {
    arr.push(pnode.childNodes[i])
  }
  tree._[id] = arr
  return arr
}
