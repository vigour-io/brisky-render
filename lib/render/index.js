'use strict'
const renderMultiple = require('./multiple')
const State = require('vigour-state')
const Element = require('../element')
const vstamp = require('vigour-stamp')
const get = require('../get')

module.exports = function render (elem, state, callback, attach, id) {
  if (!(elem instanceof Element)) {
    elem = new Element(elem, false)
  }
  const subs = elem.$map()
  const tree = {}

  if (state === void 0) {
    renderMultiple(state, 'new', 0, subs, tree)
  } else {
    const renderStamp = vstamp.create('render', state._lstamp || 0)
    if (!state || !state.isState) {
      state = new State(state, false)
    }
    renderMultiple(state, 'new', renderStamp, subs, tree)
    if (callback) {
      callback(subs, tree, state, 'new', renderStamp, subs, tree, void 0, elem)
      state.subscribe(subs, function (state, type, stamp, nsubs, ntree, sType) {
        renderMultiple(state, type, stamp, nsubs, ntree, sType)
        callback(subs, tree, state, type, stamp, nsubs, ntree, sType, elem)
      }, tree, renderStamp, attach, id)
    } else {
      state.subscribe(subs, renderMultiple, tree, renderStamp, attach, id)
    }
    vstamp.close(renderStamp)
  }
  const uid = elem.uid()

  if (elem.$) {
    let target
    let path = elem.$
    if (elem.$any || elem.$switch) {
      if (elem.$.length === 1) {
        path = []
        target = tree
      } else {
        path = elem.$.slice(0, -1)
        target = tree
        target = get(tree, path)
      }
    } else {
      target = get(tree, elem.$)
    }
    if (!target) {
      // create target on state (to do a first render)
      const obj = {}
      let len = path.length
      let i = 0
      let s = obj
      while (i < len && (s = s[path[i++]] = {}));
      state.set(obj)
      target = get(tree, path)
    }
    return target._[uid]
  } else {
    return tree._[uid]
  }
}
