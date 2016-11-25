const getParent = (type, subs, tree, pid) => {
  const _ = subs._

  if (tree._key === '$any') { // will become indexof
    tree = tree._p
  }

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
    if (_.$switch) {
      tree = tree._p
    }
    return getParent(type, _.p, tree._p, pid)
  }
}

module.exports = getParent
