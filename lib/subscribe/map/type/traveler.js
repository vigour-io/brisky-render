'use strict'
const subscriber = require('../subscriber')
const val = require('../val')

module.exports = function (target, map, prev) {
  if (target.isGroup) {
    console.error('so here were going to go hardcore')
    // console.log(target.$map())
    // subscriber(map, target)
    // subscriber(map, target, 't')

    console.log(map)

    // val(target, map, val)
  } else {
    subscriber(map, target, 't')
  }
  return map
}
