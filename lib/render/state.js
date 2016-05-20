'use strict'
const widgets = require('../widget/widgets')

module.exports = function renderState (target, state, type, stamp, subs, tree, id, pid) {
  if (type === 'remove') {
    let emitted
    for (var i = widgets.length - 1; i >= 0; i = i - 3) {
      const wtree = widgets[i]
      let ptree = wtree
      while (ptree) {
        if (tree === ptree) {
          const wtarget = widgets[i - 2]
          const wid = widgets[i - 1]
          emitRemove(wtarget, state, wtree, wid, stamp)
          widgets.splice(i - 2, 3)
          if (wid === id) {
            emitted = true
          }
        }
        ptree = ptree._p
      }
    }
    if (!emitted) {
      emitRemove(target, state, tree, id, stamp)
    }
  } else if (!tree._) {
    tree._ = {}
  }
  return target.render.state(target, state, type, stamp, subs, tree, id, pid)
}

function emitRemove (target, state, tree, id, stamp) {
  if (target.__on.removeEmitter) {
    const data = { target: tree._ && tree._[id] }
    if (state) { data.state = state }
    target.__on.removeEmitter.emit(target, stamp, data)
  }
}
