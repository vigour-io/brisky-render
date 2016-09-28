'use strict'
const render = require('../render')
const test = require('tape')
const s = require('vigour-state/s')

// remove the val from sync perhaps just call it true / 1

test('sync - basic', (t) => {
  const state = s({ field: 'its text' })
  var subs
  render({
    $: 'field',
    text: {
      $: true,
      sync: false
    },
    other: {
      subscriptionType: true,
      sync: false,
      $: 'other',
      text: { $: true }
    },
    something: {
      subscriptionType: true,
      sync: false,
      $: 'something',
      field: { $: true }
    }
  },
  state,
  (s) => { subs = s })
  t.equal(subs.field._.sync, 1, 'field')
  t.same(subs.field.other._.sync, undefined, 'field.other')
  t.same(subs.field.something._.sync, 1, 'field.something')
  t.end()
})
