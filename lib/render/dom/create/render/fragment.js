'use strict'
const parseStatic = require('../../../static')
const props = parseStatic.property

module.exports = function (target, pnode, id, tree) {
  props(target, pnode)
  // static ones allready weird...
  console.warn('REAL ---> lets add this fragment to the tree', id, tree._[id])
  const slen = pnode.childNodes.length
  // const keys = target.cParent().keys()
  const arr = [ pnode ]
  // elems(target, arr)

  // const staticElements = target.keys('staticElements')
  // for (let i = 0, len = staticElements.length; i < len; i++) {
  //   let iteratee = target[staticElements[i]]
  //   iteratee.render.static(iteratee, div)
  // }

  for (let i = slen, len = pnode.childNodes.length; i < len; i++) {
    arr.push(pnode.childNodes[i])
  }
  tree._[id] = arr
  return arr
}
