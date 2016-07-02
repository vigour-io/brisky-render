'use strict'
const iterator = require('./iterator')
const condition = require('./type/test')
const switcher = require('./type/switcher')
const collection = require('./type/collection')
const normal = require('./type')
const traveler = require('./type/traveler')
const recursive = require('./type/recursive')
var isExec // just add this on recursive

exports.define = {
  $map (map, prev) {
    var returnValue
    var ex
    const $ = this.$
    if (!map) {
      returnValue = map = this._$map = { _: { p: prev || false } }
      if (!isExec) {
        isExec = ex = true
      }
    }
    this.isStatic = null
    if ($) {
      // very heavy check ofc...
      const recursiveParent = isRecursive(this)
      if (recursiveParent) {
        recursive.add(this, recursiveParent, map, prev)
      } else {
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
      }
    } else if (iterator(this, map) || returnValue) {
      map = traveler(this, map)
      if (!returnValue) { returnValue = true }
    }

    if (ex) {
      recursive.exec()
      isExec = false
    }

    return returnValue || this.hasEvents && false
  }
}

function isRecursive (target, map) {
  var p = target._parent
  while (p) {
    if (
      p._Constructor &&
      target instanceof p._Constructor &&
      target.$ === p.$
    ) {
      return p
    }
    p = p._parent
  }
}
