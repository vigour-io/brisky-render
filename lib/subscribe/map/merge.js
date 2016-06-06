'use strict'
const mergeS = require('./subscriber/merge')
const get = require('lodash.get')
const set = require('./set')

module.exports = exports = function (subs, val, map) {
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
    merge(field, val)
    return field
  } else {
    return set(val, map, subs)
  }
}

function merge (a, b) {
  if (b && typeof b !== 'object') {
    if (!a.val) { a.val = b }
  } else {
    if (typeof b === 'object') {
      if (!b._) {
        b._ = {}
      }
      b._.p = a._.p
    }
    for (var i in b) {
      if (i !== '_') {
        if (typeof a[i] === 'object') {
          merge(a[i], b[i])
        } else if (!a[i]) {
          a[i] = b[i]
        } else if (i === 'val') {
          if (a.val !== b.val && b.val === true) {
            a.val = true
          }
        } else if (i === 'done') {
          a.done = true
        } else {
          a[i] = { val: a[i], _: { p: a } }
          merge(a[i], b[i])
        }
      } else {
        mergeS(a._, b._)
      }
    }
  }
}
