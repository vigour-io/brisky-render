'use strict'
const merge = require('../merge')
const basicMerge = merge.basic
const subscriber = require('../subscriber')

module.exports = function switcher (target, map, prevMap) {
  const $ = target.$
  if ($.length !== 1) {
    const val = { val: 1 }
    val.$switch = mapSwitch(target, val)
    map = merge(target.$.slice(0, -1), val, map)
  } else {
    map.$switch = mapSwitch(target, map)
  }
  subscriber(map, target, 't')
  return map
}

function mapSwitch (target, pmap) {
  const $switch = pmap.$switch || { exec: target.$switch, $remove: true }
  const elemprops = target.types.element.properties
  const properties = target.properties
  for (let key in properties) {
    const keyO = key[0]
    if (keyO !== '$' && keyO !== '_') {
      const prop = properties[key]
      const base = prop.base
      if (base && base.isElement && elemprops[key] !== prop) {
        const map = base.$map(void 0, pmap)
        if (key in $switch) {
          basicMerge($switch[key], map)
        } else {
          $switch[key] = map
          $switch[key].val = 1
        }
      }
    }
  }
  return $switch
}
