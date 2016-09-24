'use strict'
const valx = require('./val')

module.exports = function set (target, val, map, path) {
  const len = path.length - 1
  if (len === 0) {
    map[path[0]] = val
    val._ = { p: map }
  } else {
    let m = map
    for (let i = 0, key; i < len; i++) {
      key = path[i]
      if (!m[key]) {
        m[key] = { _: { p: m } }
      }
      if (key !== '$root' && key !== '$parent') {
        m[key].$remove = true
      }
      m = m[key]
    }
    m[path[len]] = val
    val._ = { p: m }

    if (val.val) {
      console.log('go do it')
      valx(target, val, val.val)
    }
  }
  return val
}
