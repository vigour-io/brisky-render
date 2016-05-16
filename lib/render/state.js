'use strict'
module.exports = function renderState (target, state, type, stamp, subs, tree, id, pid) {
  if (type !== 'update' && type !== 'new') {
    if (target.__on.removeEmitter) {
      const data = { target: tree._ && tree._[id] }
      if (state) { data.state = state }
      target.__on.removeEmitter.emit(target, stamp, data)
    }
  } else if (!tree._) {
    tree._ = {}
  }
  return target.render.state(target, state, type, stamp, subs, tree, id, pid)
}
