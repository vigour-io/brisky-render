const struct = require('brisky-struct')
const subscribe = require('brisky-struct/lib/subscribe').subscribe
const render = require('./render')
const element = require('../element')
const { getPath } = require('../get')

module.exports = (elem, state, cb) => {
  if (!elem.inherits) {
    elem = element.create(elem)
  }
  const subs = elem.$map()
  const tree = {}
  if (state === void 0) {
    render(state, 'new', subs, tree)
  } else {
    if (!state || !state.inherits) { state = struct(state) }
    render(state, 'new', subs, tree)
    subscribe(state, subs, render, tree)
  }
  const uid = elem.uid()
  if (cb) { cb(subs, tree, elem) }

  if (elem.$) {
    let t
    let path = elem.$
    // switch is gone
    if (elem.$any || elem.$switch) {
      if (elem.$.length === 1) {
        path = []
        t = tree
      } else {
        path = elem.$.slice(0, -1)
        t = tree
        t = getPath(tree, path)
      }
    } else {
      t = getPath(tree, elem.$)
    }
    if (!t) {
      // create t on state (to do a first render)
      const obj = {}
      let len = path.length
      let i = 0
      let s = obj
      while (i < len && (s = s[path[i++]] = {}));
      state.set(obj)
      t = getPath(tree, path)
    }
    return t._[uid]
  } else {
    return tree._[uid]
  }
}
