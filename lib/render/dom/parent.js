'use strict'
module.exports = function getParent (type, stamp, subs, tree, pid) {
  const _ = subs._
  if (!_) {
    console.log('FUCK!', tree._key, subs)
  }
  if (_.s && _.s[pid] || _.t && _.t[pid]) {
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
    return getParent(type, stamp, _.p, tree._p, pid)
  }
}
