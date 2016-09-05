'use strict'
const merge = require('../merge')
const subscriber = require('../subscriber')
const iterator = require('../iterator')
const hash = require('vigour-util/hash')

module.exports = function switcher (target, map, prevMap) {
  const $ = target.$
  let key = '$switch' + hash(target.path().join('.'))
  $[$.length - 1] = key
  if ($.length !== 1) {
    let val = { val: 1 }
    val[key] = {}
    map = merge(target.$.slice(0, -1), val, map)
    mapSwitch(val[key], target, map)
  } else {
    map[key] = mapSwitch({}, target, map)
  }
  iterator(target, map)
  subscriber(map, target, 't')
  return map
}

function mapSwitch (val, target, pmap) {
  const $switch = target.$switch
  if (typeof $switch === 'function') {
    val.exec = $switch
  }
  val.$remove = true
  const elemprops = target.types.element.properties
  const properties = target.properties
  for (let key in properties) {
    const keyO = key[0]
    if (keyO !== '$' && keyO !== '_') {
      const prop = properties[key]
      const base = prop.base
      if (base && base.isElement && elemprops[key] !== prop) {
        const map = base.$map(void 0, pmap)
        val[key] = map
        if (!('val' in map)) { map.val = 1 }
      }
    }
  }
  return val
}
