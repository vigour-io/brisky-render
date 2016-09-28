'use strict'
const render = require('../render')
const test = require('tape')
const s = require('vigour-state/s')

test('sync - basic', (t) => {
  const state = s({
    field: 'its text'
  })

  render({
    $: 'field',
    text: {
      $: true,
      sync: false
    }
  },
  state,
  (subs) => {
    console.log(subs)
  })

  t.end()
})
