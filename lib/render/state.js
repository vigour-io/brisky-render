'use strict'
// const widgets = require('../widget/widgets')

module.exports = (t, state, type, subs, tree, id, pid, order) => {
  if (type === 'remove') {
    // for (let i = widgets.length - 1; i >= 0; i = i - 3) {
    //   const wtree = widgets[i]
    //   let ptree = wtree
    //   while (ptree) {
    //     if (tree === ptree) {
    //       emitRemove(widgets[i - 2], state, wtree, widgets[i - 1])
    //       widgets.splice(i - 2, 3)
    //     }
    //     ptree = ptree._p
    //   }
    // }
    // if (!t.isWidget) {
    //   emitRemove(t, state, tree, id)
    // }
  } else if (!tree._) {
    tree._ = {}
  }
  console.log(id, pid)
  return t.render.state(t, state, type, subs, tree, id, pid, order)
}

// function emitRemove (t, state, tree, id, stamp) {
//   const removeEmitter = t._emitters.removeEmitter
//   if (removeEmitter) {
//     const data = { t: tree._ && tree._[id] }
//     if (state) { data.state = state }
//     removeEmitter.emit(t, data, stamp)
//   }
// }
