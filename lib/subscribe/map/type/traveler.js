'use strict'
const subscriber = require('../subscriber')

module.exports = function (target, map, prev) {
  if (target.isGroup) {
    console.log('yo val true biatch')
    subscriber(map, target, 's')
    map.val = true
  } else {
    subscriber(map, target, 't')
  }
  return map
}
