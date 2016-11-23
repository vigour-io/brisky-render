'use strict'
const iterator = require('./iterator')
// const condition = require('./type/test')
// const switcher = require('./type/switcher')
const any = require('./type/any')
const normal = require('./type')
const object = require('./type/object')
const traveler = require('./type/traveler')

// dont define just require
module.exports = {
  define: {
    $map (map, prev) {
      var returnValue
      const $ = this.$

      console.log('map', this.path())

      if (!map) {
        returnValue = map = this._$map = { _: { p: prev || false } }
      }
      this.isStatic = null
      if ($) {
        if (typeof $ === 'object' && !($ instanceof Array)) {
          if (!returnValue) { returnValue = true }
          map = object(this, map)
        } else {
          if ($[0] === '$root' && (!map || !map._ || !map._.p)) {
            $.shift()
          }
          if (!returnValue) { returnValue = true }
          if (this.$test) {
            // map = condition(this, map)
          } else if (this.$switch) {
            // map = switcher(this, map)
          } else if (this.$any) {
            map = any(this, map)
          } else {
            map = normal(this, map)
          }
        }
      } else if (iterator(this, map) || returnValue) {
        map = traveler(this, map)
        if (!returnValue) { returnValue = true }
      }

      return returnValue
    }
  }
}
