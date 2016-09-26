'use strict'
const merge = require('../merge')
const subscriber = require('../subscriber')
const iterator = require('../iterator')

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
    const val = { val: 1 }
    let walk = map
    let exists
    val.$any = child.$map(void 0, exists ? walk : val)
    if (!val.$any.val) {
      if (!child.$test) {
        val.$any.val = 1
      } else {
        console.log('add val 1 in child.$test.$pass')
      }
    }
    if (val.$any._.sync) {
      val.$any._.sync.val = 1
      console.warn('ai')
    }
    val.$remove = true
    map = merge(target, path, val, map)
  } else {
    map.$any = child.$map(void 0, map)
    if (!map.$any.val) {
      if (!child.$test) {
        if (map.$any._.sync) {
          console.warn('ai')
        }
        map.$any.val = 1
      } else {
        console.log('add val 1 in child.$test.$pass')
      }
      if (map.$any._.sync) {
        map.$any._.sync.val = 1
        console.warn('ai2')
      }
    }
  }

  iterator(target, map)
  subscriber(map, target, 't')
  return map
}
