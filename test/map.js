'use strict'
const isObj = require('vigour-util/is/obj')
const Elem = require('../lib/element')
const test = require('tape')
const e = (set) => new Elem(set)
const slice = [].slice

test('element map', function (t) {
  var elem, map
  t.plan(4)

  elem = e()
  map = prep(elem.$map())
  t.same(map, {
    _: obj('t', elem)
  }, 'empty element, no subs')

  elem = e({ holder: {} })
  map = prep(elem.$map())
  t.same(map, {
    _: obj('t', elem)
  }, 'element with child, no subs')

  elem = e({ $: 'field' })
  map = prep(elem.$map())
  t.same(map, {
    field: sub(1, 't', elem),
    _: {}
  }, 'element, sub')

  elem = e({ holder: { $: 'field' } })
  map = prep(elem.$map())
  t.same(map, {
    field: sub(1, 't', elem.holder),
    _: obj('t', elem)
  }, 'element with child, nested sub')
})

// starts uids from 1 in each object and removes parent field
function prep (map) {
  if (isObj(map)) {
    let remap = {}
    for (let i in map) {
      if (i !== 'tList' && i !== 'p') {
        remap[i] = prep(map[i])
      }
    }
    return remap
  } else {
    return map
  }
}

function sub (val) {
  var set = arguments[arguments.length - 1]
  var arr
  if (isObj(set)) {
    arr = slice.call(arguments, 1, -1)
  } else {
    arr = slice.call(arguments, 1)
    set = {}
  }
  set.val = val
  set._ = obj.apply(null, arr)
  return set
}

// creates store for every string argument and populates with following arguments
function obj () {
  const l = arguments.length
  const obj = {}
  let target
  for (let i = 0; i < l; i++) {
    const val = arguments[i]
    if (typeof val === 'string') {
      target = obj[val] = {}
    } else {
      const elem = arguments[i]
      // @todo needs context uid
      target[elem._uid] = elem
    }
  }
  return obj
}
