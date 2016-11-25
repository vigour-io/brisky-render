const getParent = require('../../render/dom/parent')
exports.properties = { name: true }

exports.type = 'property'

exports.render = {
  static (target, pnode) {
    // needs coverage
    pnode.style[target.name || target.key] = target.compute()
  },
  state (target, s, type, subs, tree, id, pid) {
    if (type !== 'remove') {
      const pnode = getParent(type, subs, tree, pid)
      pnode.style[target.name || target.key] = s
      ? target.compute(s, s)
      : target.compute()
    }
  }
}
