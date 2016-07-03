'use strict'
const render = require('../render')
const test = require('tape')
const s = require('vigour-state/s')
const p = require('parse-element')

test('render', (t) => {
  const state = s({
    field: 'its text'
  })
  var cnt = 0

  const app = render(
    {
      $: 'field',
      text: { $: true }
    },
    state,
    () => { cnt++ },
    void 0,
    'someId'
  )
  t.equal(p(app), '<div>its text</div>', 'initial')
  state.field.set('update')
  t.equal(p(app), '<div>update</div>', 'fires update')
  t.same(state.emitters.subscription.fn.keys(), [ 'someId' ], 'adds listener to correct id')
  t.equal(cnt, 3, 'fired callback for each render')
  t.end()
})
