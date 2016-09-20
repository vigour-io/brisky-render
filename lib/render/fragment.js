'use strict'

exports.findParent = (pnode) => {
  while (isFragment(pnode)) {
    pnode = pnode[0]
  }
  return pnode
}

exports.isFragment = isFragment

function isFragment (node) {
  return node instanceof Array
}
