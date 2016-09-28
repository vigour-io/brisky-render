'use strict'
const merge = require('../merge')
const iterator = require('../iterator')
const subscriber = require('../subscriber')
const val = require('../val')

module.exports = function normal (target, map) {
  const def = target.subscriptionType
  const path = target.$
  var type
  type = def === 1 ? 't' : 's'

  if (path !== true) {
    // we need to find the previous one if its non syncing...
    map = merge(target, path, { val: def }, map)
  } else {
    // target cannot allways be good enough...
    val(target, map, def)
  }
  iterator(target, map)
  subscriber(map, target, type)
  return map
}
