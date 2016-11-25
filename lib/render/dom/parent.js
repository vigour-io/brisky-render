module.exports = function getParent (type, subs, tree, pid) {
  const _ = subs._
  // if (!tree._ && /^\$switch/.test(tree._key)) {
    // console.log('yo yo yo')
    // tree = tree._p
  // }

  // if (_.$switch) {
    // console.log('here we go')
    // tree = tree._p._p
  // }
  // if (!tree._) { // replacement of switch check
  //   console.log(_, tree)
  //   // not good
    // tree = tree._p
  // }

  if (_.t && _.t[pid]) {
    const node = tree._[pid]
    if (node) {
      return node
    } else if (type === 'new' || type === 'update') {
      const err = new Error(
        'No parent in tree' +
        `\n  type: "${type}" \n  pid: "${pid}"` +
        `\n  path: "${(_.s && _.s[pid] || _.t && _.t[pid]).path().join('/')}"`
      )
      Object.defineProperty(err, 'name', { value: 'ElementError' })
      throw err
    }
  } else if (_.p) {
    if (tree._p._key === '$any' || _.$switch) { // or switch
      tree = tree._p
    }
    return getParent(type, _.p, tree._p, pid)
  }
}
