const parent = (tree, pid) => tree._ && tree._[pid] ||
  tree._p && parent(tree._p, pid)

export default parent
