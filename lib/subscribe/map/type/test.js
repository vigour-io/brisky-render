'use strict'
const merge = require('../merge')
const iterator = require('../iterator')
const subscriber = require('../subscriber')

module.exports = function test (target, map) {
  const $test = target.$test
  const val = { $pass: { val: 1, _: { p: map } } }
  if (typeof $test === 'function') {
    val.exec = $test
  } else {
    val.exec = $test.val
    val.$ = $test.$
  }
  const $pass = merge(target.$, val, map).$pass
  iterator(target, $pass)
  subscriber($pass, target, 't')
  return $pass
}

