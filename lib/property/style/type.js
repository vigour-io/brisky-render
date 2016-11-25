'use strict'
const getParent = require('brisky-core/lib/render/dom/parent')
exports.properties = { name: true }

exports.type = 'property'

exports.render = {
  static (target, pnode) {
    // needs coverage
    pnode.style[target.name || target.key] = target.compute()
  },
  state (target, _state, type, stamp, subs, tree, id, pid) {
    if (type !== 'remove') {
      const pnode = getParent(type, stamp, subs, tree, pid)
      pnode.style[target.name || target.key] = _state
      ? target.compute(_state)
      : target.compute()
    }
  }
}
