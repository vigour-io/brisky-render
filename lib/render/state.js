'use strict'
const widgets = require('../widget/widgets')

module.exports = function renderState (target, state, type, stamp, subs, tree, id, pid) {
  if (type === 'remove') {
    for (let i = widgets.length - 1; i >= 0; i = i - 3) {
      const wtree = widgets[i]
      let ptree = wtree
      while (ptree) {
        if (tree === ptree) {
          emitRemove(widgets[i - 2], state, wtree, widgets[i - 1], stamp)
          widgets.splice(i - 2, 3)
        }
        ptree = ptree._p
      }
    }
    if (!target.isWidget) {
      emitRemove(target, state, tree, id, stamp)
    }
  } else if (!tree._) {
    tree._ = {}
  }
  return target.render.state(target, state, type, stamp, subs, tree, id, pid)
}

function emitRemove (target, state, tree, id, stamp) {
  const removeEmitter = target.__on.removeEmitter
  if (removeEmitter) {
    const data = { target: tree._ && tree._[id] }
    if (state) { data.state = state }
    removeEmitter.emit(target, data, stamp)
  }
}
