'use strict'
const getParent = require('../render/dom/parent')

exports.properties = {
  hasEvents: {
    type: 'property',
    $: true, // crashes when static!
    render: {
      state  (target, state, type, stamp, subs, tree, id, pid) {
        var node = getParent(type, stamp, subs, tree, pid)
        console.log('LULLLZ')
      }
    }
  }
}

/*
  if (target.hasEvents) {
    if (state) {
      node._sc = state.storeContext() // has to change today -- get rid of this piece of dirt
      node._s = state
    }
    node._ = target
  }
*/