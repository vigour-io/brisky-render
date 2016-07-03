'use strict'
module.exports = function getParent (type, stamp, subs, tree, pid) {
  const _ = subs._

  if (!tree._ && /^\$switch/.test(tree._key)) {
    tree = tree._p
  }

  if (_.s && _.s[pid] || _.t && _.t[pid]) {
    const node = tree._[pid]
    if (node) {
      return node
    } else if (type === 'new' || type === 'update') {
      // make a test for this when it happens
      const err = new Error(
        'No parent in tree' +
        `\n  type: "${type}" \n  pid: "${pid}"` +
        `\n  path: "${(_.s && _.s[pid] || _.t && _.t[pid]).path().join('/')}"`
      )
      Object.defineProperty(err, 'name', { value: 'ElementError' })
      // throw err
      console.error(err)
    }
  } else if (_.p) {
    if (tree._p._key === '$any') {
      tree = tree._p
    }
    return getParent(type, stamp, _.p, tree._p, pid)
  }
}

// 15,20,22
