const parseStatic = require('../../../static')
const elems = parseStatic.element

module.exports = (target, pnode, id, tree) => {
  const arr = [ pnode ]
  elems(target, arr)
  tree._[id] = arr
  return arr
}
