'use strict'
const renderMultiple = require('./multiple')
const State = require('vigour-state')
const Element = require('../element')
const get = require('lodash.get')
const set = require('lodash.set')
const vstamp = require('vigour-stamp')

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
      callback(subs, tree, state, 'new', renderStamp, subs, tree)
      state.subscribe(subs, function (state, type, stamp, nsubs, ntree, sType) {
        renderMultiple(state, type, stamp, nsubs, ntree, sType)
        callback(subs, tree, state, type, stamp, nsubs, ntree, sType)
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
        target = get(tree, path)
      }
    } else {
      target = get(tree, elem.$)
    }
    if (!target) {
      // create target on state (to do a first render)
      const obj = {}
      set(obj, path, {})
      state.set(obj)
      target = get(tree, path)
    }
    return target._[uid]
  } else {
    return tree._[uid]
  }
}
