'use strict'
const subscriber = require('../subscriber')
module.exports = function (target, map, prev) {
  if (!target.isGroup) {
    // maybe not for properties in general
    subscriber(map, target, 't')
  }
  return map
}
