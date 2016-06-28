'use strict'
const merge = require('../merge')
const iterator = require('../iterator')
const subscriber = require('../subscriber')

module.exports = function normal (target, map) {
  const def = target.subscriptionType
  const path = target.$
  var type
  type = def === 1 ? 't' : 's'
  if (path !== true) {
    map = merge(path, { val: def }, map)
  } else if (map.val !== true) {
    map.val = def
  }
  iterator(target, map)
  subscriber(map, target, type)
  return map
}
