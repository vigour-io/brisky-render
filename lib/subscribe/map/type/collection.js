'use strict'
const merge = require('../merge')
const subscriber = require('../subscriber')
const iterator = require('../iterator')

module.exports = function collection (target, map) {
  const child = target.Child.prototype
  const $ = target.$
  if (target.__c || !target.hasOwnProperty('Child')) {
    if (child === target.types.element) {
      throw new Error('$any: Child === Element. Define a Child Element')
    } else {
      child.__c = target
      child._cLevel = 1
    }
  }
  if ($.length !== 1) {
    const path = target.$.slice(0, -1)
    const val = {}
    val.$any = child.$map(void 0, val)
    val.$any.val = 1
    val.val = 1
    map = merge(path, val, map)
  } else {
    map.$any = child.$map(void 0, map)
    map.$any.val = 1
  }
  iterator(target, map)
  subscriber(map, target, 't')
  return map
}
