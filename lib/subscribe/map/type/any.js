'use strict'
const merge = require('../merge')
const subscriber = require('../subscriber')
const iterator = require('../iterator')
const setVal = require('../val')
// module.exports = (target, map, val) => {

module.exports = function collection (target, map) {
  const child = target.child.prototype
  const $ = target.$
  if (target.__c || !target.hasOwnProperty('child')) {
    if (child === target.types.element) {
      throw new Error('brisky-core: $any: child === Element. Define a child Element ' + target.path())
    } else {
      child.__c = target
      child._cLevel = 1
    }
  }

  if ($.length !== 1) {
    const path = target.$.slice(0, -1)

    // we want to do this ourselves...
    const val = { val: 1 }
    let walk = map
    let exists
    val.$any = child.$map(void 0, exists ? walk : val)
    if (!val.$any.val) {
      if (!child.$test) {
        setVal(child, val.$any, 1)
      } else {
        console.log('add val 1 in child.$test.$pass')
      }
    }

    if (!child.$test && child.sync !== false && val.$any._.sync === true) {
      val.$any._.sync = 1
    }
    val.$remove = true
    map = merge(target, path, val, map)
  } else {
    map.$any = child.$map(void 0, map)
    if (!map.$any.val) {
      if (!child.$test) {
        setVal(child, map.$any, 1)
      } else {
        console.log('add val 1 in child.$test.$pass')
      }
    }

    if (!child.$test && child.sync !== false && map.$any._.sync === true) {
      map.$any._.sync = 1
    }
  }

  iterator(target, map)
  subscriber(map, target, 't')
  return map
}
