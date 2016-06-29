'use strict'
const subscriber = require('../subscriber')

module.exports = function (target, map, prev) {
  if (target.isGroup) {
    subscriber(map, target, 's')
    map.val = true
  } else {
    subscriber(map, target, 't')
  }
  return map
}
