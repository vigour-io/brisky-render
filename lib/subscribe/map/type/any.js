'use strict'
const merge = require('../merge')
const subscriber = require('../subscriber')
const iterator = require('../iterator')
const setVal = require('../val')
const { get$, get$switch } = require('../get')

module.exports = (t, map) => {
  const props = t.get('props')
  const child = props.default.struct

  const $ = get$(t)

  child.key = 'default'
  if (t.context || t !== child._p) {
    // console.log('IN CONTEXT', child)
    child.context = t
    child.contextLevel = 1
  }

  if ($.length !== 1) {
    const path = $.slice(0, -1)
    const val = { val: 1 } // wrong for switch .. what to do
    let walk = map
    let exists
    val.$any = child.$map(void 0, exists ? walk : val)
    if (!val.$any.val) {
      if (!get$switch(child)) {
        setVal(child, val.$any, 1)
      }
    }
    // if (!child.$test && child.sync !== false && val.$any._.sync === true) {
    //   val.$any._.sync = 1
    // }
    // val.$remove = true
    map = merge(t, path, val, map)
  } else {
    map.$any = child.$map(void 0, map)
    if (!map.$any.val) {
      if (!get$switch(child)) {
        setVal(child, map.$any, 1)
      }
    }
    // if (!child.$test && child.sync !== false && map.$any._.sync === true) {
    //   map.$any._.sync = 1
    // }
  }

  iterator(t, map)
  subscriber(map, t, 't')
  return map
}
