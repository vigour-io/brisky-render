'use strict'
const subscriber = require('../subscriber')

module.exports = function (target, map, prev) {
  subscriber(map, target, 't')
  return map
}
