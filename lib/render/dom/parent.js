const getParent = (type, subs, tree, pid) => {
  // const _ = subs._

  if (tree._key === '$any') { // will become indexof
    tree = tree._p
  }

  if (tree._ && tree._[pid]) {
    // if removed ... dont
    return tree._[pid]
  } else if (tree._p) {
    // if (_.$switch) {
    //   tree = tree._p
    //   // console.log('?????', tree, _, pid)
    //   if (tree._ && tree._[pid]) {
    //     return tree._[pid]
    //   }
    // }
    return getParent(type, void 0, tree._p, pid)
  }
}

module.exports = getParent
