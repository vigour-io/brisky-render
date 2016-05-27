'use strict'
const merge = require('../merge')
const iterator = require('../iterator')
const subscriber = require('../subscriber')

module.exports = function test (target, map) {
  const $test = target.$test
  const test = { $pass: { val: 1 } }
  var $pass

  if (typeof $test === 'function') {
    test.exec = $test
  } else {
    test.exec = $test.val
    test.$ = $test.$
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

