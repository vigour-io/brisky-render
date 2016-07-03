'use strict'
const render = require('../render')
const test = require('tape')
const s = require('vigour-state/s')
const p = require('parse-element')
const Observable = require('vigour-observable')

test('render - id, callback', (t) => {
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
    false,
    'someId'
  )
  t.equal(p(app), '<div>its text</div>', 'initial')
  state.field.set('update')
  t.equal(p(app), '<div>update</div>', 'fires update')
  t.same(state.emitters.subscription.fn.keys(), [ 'someId' ], 'adds listener to correct id')
  t.equal(cnt, 3, 'fired callback for each render')
  t.end()
})

test('render - attach + $any on top', (t) => {
  const state = s([ 1, 2 ])
  const b = new Observable()
  const app = render(
    {
      $: '$any',
      tag: 'ul',
      child: {
        tag: 'li',
        text: { $: true }
      }
    },
    state,
    false,
    b
  )
  t.equal(p(app), '<ul><li>1</li><li>2</li></ul>', 'initial')
  t.same(state.emitters.subscription.attach.keys(), [ 1 ], 'adds attach-listener')
  b.remove()
  t.same(state.emitters.subscription.attach.keys(), [], 'removes attach-listener')
  t.end()
})

test('render - $switch on top', (t) => {
  const state = s({
    text: ':/',
    html: ':)'
  })
  const app = render(
    {
      $: 'a.$switch',
      $switch: (state) => state.key,
      properties: {
        text: { type: 'text', $: true },
        html: { type: 'element', html: { $: true } }
      }
    },
    state
  )
  t.equal(p(app), '<div></div>', 'initial')
  t.ok('a' in state, 'created field on init')
  state.a.set('$root.text')
  t.equal(p(app), '<div>:/</div>', 'swtich')
  state.a.set('$root.html')
  t.equal(p(app), '<div><div>:)</div></div>', 'change reference')
  t.end()
})
