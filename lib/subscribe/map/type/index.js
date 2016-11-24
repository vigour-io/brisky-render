'use strict'
const merge = require('../merge')
const iterator = require('../iterator')
const subscriber = require('../subscriber')
const val = require('../val')

const getType = t => t.subscriptionType || t.inherits && getType(t.inherits)

module.exports = function normal (t, map) {
  const def = getType(t)
  const path = t.$
  const type = def === 1 ? 't' : 's'

  if (path !== true) {
    // we need to find the previous one if its non syncing...
    map = merge(t, path, { val: def }, map)
  } else {
    // t cannot allways be good enough...
    val(t, map, def)
  }
  iterator(t, map)
  subscriber(map, t, type)
  return map
}
