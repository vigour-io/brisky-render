'use strict'
const merge = require('../merge')
const iterator = require('../iterator')
const subscriber = require('../subscriber')
const hash = require('quick-hash')
const val = require('../val')

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
    map = merge(target, path, val, map)
    $pass = map[key].$pass
  } else {
    $pass = merge(target, target.$, test, map).$pass
  }
  $pass._ = { p: map }
  iterator(target, $pass)
  subscriber($pass, target, type === true ? 's' : 't')

  val(target, $pass, type)

  return $pass
}

function parse (obj, key) {
  const type = typeof obj
  if (type === 'object') {
    for (let i in obj) {
      if (i !== 'val') {
        obj[i] = parse(obj[i], i)
      }
    }
  } else if (type === 'string') {
    const path = obj.split('.')
    for (let i = 0, s = obj = {}, len = path.length; i < len; i++) {
      s = s[path[i]] = {}
    }
  } else {
    obj = { val: true }
  }
  return obj
}
