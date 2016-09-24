'use strict'
const merge = require('../merge')
const iterator = require('../iterator')
const subscriber = require('../subscriber')

module.exports = function normal (target, map) {
  const def = target.subscriptionType
  const path = target.$
  var type

  if (target.sync === false) {
    console.warn('noSync...', target.path())

    // need to create a list in _ i geuss
    if (!map.val) {
      console.warn('simple case')
    }

  } else {
    console.log('ok normal', target.path())
  }

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
