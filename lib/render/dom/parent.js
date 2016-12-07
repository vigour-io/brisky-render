const parent = (tree, pid) => tree._ && tree._[pid] ||
  tree._p && parent(tree._p, pid)

module.exports = parent
