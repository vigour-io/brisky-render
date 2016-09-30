'use strict'
const subscriber = require('../subscriber')
module.exports = function (target, map, prev) {
  if (!target.isGroup) {
    // maybe not for properties in general
    subscriber(map, target, 't')
  } else {
    // if context key
    // if (target.storeContextKey) {
    subscriber(map, target, 't')
    // }
  }
  return map
}
