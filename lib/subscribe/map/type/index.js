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

  if (target.sync === false) {
    console.error('???', target.path(), target.sync === false, map.val)
  }

  if (path !== true) {
    // we need to find the previous one if its non syncing...
    console.info('\n -----', target.path())
    map = merge(target, path, { val: def }, map)
  } else {
    val(target, map, def)
  }
  iterator(target, map)
  subscriber(map, target, type)
  return map
}
