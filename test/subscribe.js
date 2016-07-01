'use strict'
const render = require('../render')
const test = require('tape')
const s = require('vigour-state/s')
const p = require('parse-element')

test('subscribe - merge', (t) => {
  const state = s({
    field: 'its text'
  })
  const app = render(
    {
      text: { $: 'field' },
      a: { tag: 'a', $: 'field' }
    },
    state
  )
  t.equal(p(app), '<div>its text<a></a></div>', 'initial')
  state.field.set('update')
  t.equal(p(app), '<div>update<a></a></div>', 'fires update')
  t.end()
})
