'use strict'
const iterator = require('./iterator')
const condition = require('./type/test')
const switcher = require('./type/switcher')
const collection = require('./type/collection')
const normal = require('./type')
const traveler = require('./type/traveler')

exports.define = {
  $map (map, prev) {
    var returnValue
    const $ = this.$
    if (!map) {
      returnValue = map = this._$map = { _: { p: prev || false } }
    }
    this.isStatic = null
    if ($) {
      if ($[0] === '$root' && (!map || !map._ || !map._.p)) {
        $.shift()
      }
      if (!returnValue) { returnValue = true }
      if (this.$test) {
        map = condition(this, map)
      } else if (this.$switch) {
        map = switcher(this, map)
      } else if (this.$any) {
        map = collection(this, map)
      } else {
        map = normal(this, map)
      }
    } else if (iterator(this, map) || returnValue) {
      map = traveler(this, map)
      if (!returnValue) { returnValue = true }
    }
    return returnValue
  }
}
