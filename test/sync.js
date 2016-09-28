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

test('sync - $any', (t) => {
  const state = s({ field: 'its text' })
  var subs
  render({
    a: {
      $: 'a.$any',
      child: { $: true, sync: false }
    },
    b: {
      $: 'b.$any',
      child: {
        $: true,
        text: { $: true, sync: false }
      }
    },
    c: {
      $: 'c.$any',
      child: { text: { $: true, sync: false } }
    },
    d: {
      $: 'd',
      field: {
        $: '$any',
        child: { text: { $: true, sync: false } }
      }
    }
  },
  state,
  (s) => { subs = s })
  t.equal(subs.a.$any._.sync, true, 'a.$any')
  t.equal(subs.b.$any._.sync, 1, 'b.$any')
  t.equal(subs.b.$any._.sync, 1, 'c.$any')
  t.equal(subs.b.$any._.sync, 1, 'd.$any')
  t.end()
})
