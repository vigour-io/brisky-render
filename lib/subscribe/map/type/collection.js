'use strict'
const merge = require('../merge')
const subscriber = require('../subscriber')
const iterator = require('../iterator')

module.exports = function collection (target, map) {
  const child = target.child.prototype
  const $ = target.$
  if (target.__c || !target.hasOwnProperty('child')) {
    if (child === target.types.element) {
      throw new Error('$any: child === Element. Define a child Element ' + target.path())
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
    for (let i = 0, len = $.length - 1; i < len; i++) {
      if (walk[$[i]]) {
        walk = walk[$[i]]
      } else {
        break
      }
      if (i === len - 1) {
        console.error('EXISTS')
        exists = true
      }
    }
    val.$any = child.$map(void 0, exists ? walk : val)
    val.$any.val = 1
    map = merge(path, val, map)
  } else {
    map.$any = child.$map(void 0, map)
    map.$any.val = 1
  }
  iterator(target, map)
  subscriber(map, target, 't')
  return map
}
