'use strict'
const merge = require('../merge')
const iterator = require('../iterator')
const subscriber = require('../subscriber')
const set = require('lodash.set') // dirty dash
const hash = require('vigour-util/hash')

module.exports = function test (target, map) {
  const $test = target.$test
  const type = target.subscriptionType
  var test = { $pass: { val: type } }
  var $pass
  if (typeof $test === 'function') {
    test.exec = $test
  } else {
    test.exec = $test.val
    test.$ = parse($test.$)
  }
  let key = '$test' + hash(target.path().join('.'))

  target.$[target.$.length - 1] = key
  if (target.$.length !== 1) {
    const path = target.$.slice(0, -1)
    const val = { [key]: test }
    if (!val.val) { val.val = 1 } // @todo: verify if this is ok
    val.$remove = true
    map = merge(target, path, val, map)
    $pass = map[key].$pass
  } else {
    $pass = merge(target, target.$, test, map).$pass
  }
  $pass._ = { p: map }
  iterator(target, $pass)
  subscriber($pass, target, type === true ? 's' : 't')
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
