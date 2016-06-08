'use strict'

const render = require('../render')
const test = require('tape')
const p = require('parse-element')
const s = require('vigour-state/s')

test('remove', (t) => {
  const state = s({ first: true })
  // add broken operator case and everything
  const app = render({
    first: {
      tag: 'h1',
      $: 'first'
    }
  }, state)
  t.equal(p(app), '<div><h1></h1></div>', 'correct initial html')
  state.first.remove()
  t.equal(p(app), '<div></div>', 'removed node')
  t.end()
})
