'use strict'
const merge = require('../merge')
const iterator = require('../iterator')
const subscriber = require('../subscriber')

module.exports = function condition (target, map, prevMap) {
  const $condition = merge(target.$, target.$condition, map)
  const $pass = $condition.$pass = {}
  $pass._ = { p: map }
  $pass.val = 1
  iterator(target, $condition.$pass)
  subscriber($condition.$pass, target, 't')
  return map
}

