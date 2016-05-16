'use strict'
const merge = require('../merge')
const iterator = require('../iterator')
const subscriber = require('../subscriber')

module.exports = function condition (target, map) {
  const $condition = target.$condition
  const $pass = merge(target.$, {
    val: $condition.val,
    $subs: $condition.$subs,
    $pass: {
      val: 1,
      _: { p: map }
    }
  }, map).$pass

  iterator(target, $pass)
  subscriber($pass, target, 't')
  return $pass
}

