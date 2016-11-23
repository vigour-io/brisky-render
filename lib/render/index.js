const render = require('./multiple')
// const renderMultiple = () => {}
const struct = require('brisky-struct')

const s = require('brisky-struct/lib/struct')
s.set({
  inject: require('brisky-struct/lib/debug')
})

const element = require('../element')
const bstamp = require('brisky-stamp')
const get = require('../get')

module.exports = (elem, state) => {
  if (!elem.inherits) { elem = element.create(elem, false) }
  const subs = elem.$map()
  var tree
  if (state === void 0) {
    tree = {}
    render(state, 'new', subs, tree)
  } else {
    const stamp = bstamp.create('render', state.tStamp || 0)
    if (!state || !state.inherits) { state = struct(state, false) }
    tree = state.subscribe(subs, render)
    render(state, 'new', subs, tree)
    bstamp.close()
  }

  const uid = elem.uid()

  console.log(elem.inspect(), subs)

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
        t = get(tree, path)
      }
    } else {
      t = get(tree, elem.$)
    }
    if (!t) {
      // create t on state (to do a first render)
      const obj = {}
      let len = path.length
      let i = 0
      let s = obj
      while (i < len && (s = s[path[i++]] = {}));
      state.set(obj)
      t = get(tree, path)
    }
    return t._[uid]
  } else {
    console.log('!!!!', tree)
    return tree._[uid]
  }
}
