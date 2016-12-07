const getParent = (tree, pid) => {
  if (tree._ && tree._[pid]) {
    return tree._[pid]
  } else if (tree._p) {
    return getParent(tree._p, pid)
  }
}

module.exports = getParent
