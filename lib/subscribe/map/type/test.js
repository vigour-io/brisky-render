'use strict'
const merge = require('../merge')
const iterator = require('../iterator')
const subscriber = require('../subscriber')
const set = require('lodash.set')

module.exports = function test (target, map) {
  const $test = target.$test
  var test = { $pass: { val: 1 } }
  var $pass

  if (typeof $test === 'function') {
    test.exec = $test
  } else {
    test.exec = $test.val
    test.$ = parse($test.$)
  }

  if (target.$.length !== 1) {
    const path = target.$.slice(0, -1)
    const val = { $test: test }
    val.val = 1
    map = merge(path, val, map)
    $pass = map.$test.$pass
  } else {
    $pass = merge(target.$, test, map).$pass
  }

  $pass._ = { p: map }
  iterator(target, $pass)
  subscriber($pass, target, 't')
  return $pass
}

function parse (obj) {
  const type = typeof obj
  if (type === 'object') {
    for (let i in obj) {
      obj[i] = parse(obj[i])
    }
  } else if (type === 'string') {
    const path = obj
    set(obj = {}, path, {})
  } else {
    obj = {}
  }
  return obj
}
