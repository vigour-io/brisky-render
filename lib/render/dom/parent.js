'use strict'
module.exports = function getParent (type, subs, tree, pid) {
  const _ = subs._
  // if (!tree._ && /^\$switch/.test(tree._key)) {
  //   tree = tree._p
  // }

  // console.log('?????', _, pid)
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
    if (tree._p._key === '$any') {
      tree = tree._p
    }
    return getParent(type, _.p, tree._p, pid)
  }
}
