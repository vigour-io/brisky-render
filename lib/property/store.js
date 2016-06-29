'use strict'
exports.define = {
  getStore (tree, id) {
    if (this.$ !== true) {
      tree = tree._p
      while (!tree.$ && tree._p) {
        tree = tree._p
      }
    }
    const _ = tree._ || (tree._ = {})
    const store = _[id] || (_[id] = {})
    return store
  }
}
