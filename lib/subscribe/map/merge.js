'use strict'
const mergeS = require('./subscriber/merge')
const get = require('../../get')
const set = require('./set')
const val = require('./val')

module.exports = exports = function (target, subs, val, map) {
  const field = get(map, subs)
  if (field) {
    if (subs.length > 1) {
      for (let i = 0, len = subs.length - 1, m = map, key; i < len; i++) {
        key = subs[i]
        m = m[key]
        if (key !== '$root' && key !== '$parent') {
          m.$remove = true
        }
      }
    }
    merge(target, field, val)
    return field
  } else {
    return set(target, val, map, subs)
  }
}

function merge (target, a, b) {
  if (b && typeof b !== 'object') {
    if (!a.val) { a.val = b }
  } else {
    if (typeof b === 'object') {
      if (!b._) {
        b._ = {}
      }
      b._.p = a._.p
    }
    for (let i in b) {
      if (i !== '_') {
        if (typeof a[i] === 'object') {
          merge(target, a[i], b[i])
        } else if (!a[i]) {
          a[i] = b[i]
        } else if (i === 'val') {
          // alse remove this specific true thing
          if (a.val !== b.val && b.val === true) {
            // pretty wrong since i need the info of the target in the def
            val(target, a, true)
          }
        } else {
          let prev = a[i]
          // maybe copy sync?
          a[i] = { _: { p: a } }
          val(target, a[i], prev)
          merge(target, a[i], b[i])
        }
      } else {
        mergeS(a._, b._)
      }
    }
  }
}
