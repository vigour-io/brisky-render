const parent = require('../../render/dom/parent')
exports.properties = { name: true }

exports.type = 'property'

exports.render = {
  static (target, pnode) {
    // needs coverage
    pnode.style[target.name || target.key] = target.compute()
  },
  state (t, s, type, subs, tree, id, pid) {
    if (type !== 'remove') {
      const pnode = parent(tree, pid)
      pnode.style[t.name || (t.key !== 'default' ? t.key : s.key)] = s
      ? t.compute(s, s)
      : t.compute()
    }
  }
}
