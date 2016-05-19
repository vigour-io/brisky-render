'use strict'
const subscriber = require('../subscriber')

module.exports = function (target, map, prev) {
  if (target.defaultSubscription === 'done') {
    nesteddone(target, map)
    if ('$root' in map || '$parent' in map) {
      subscriber(map, target, 'd')
      map.done = true
    }
  } else {
    subscriber(map, target, 't')
  }
  return map
}

function nesteddone (target, map, prev) {
  if (typeof map === 'object') {
    for (let i in map) {
      if (i !== 'val' && i !== '_' && i !== 'done') {
        nesteddone(target, map[i], map)
      }
    }
    if (map.val === true) {
      prev.done = true
      subscriber(prev, target, 'd')
    }
  }
}
