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

test('subscribe - resubscribe', (t) => {
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
  state.field.set('update')
  t.equal(p(app), '<div>update<a></a></div>', 'fires update')
  state.field.val = 'silent update'
  state.resubscribe()
  t.equal(p(app), '<div>silent update<a></a></div>', 'fires silent update')
  t.end()
})

test('subscribe - resubscribe - switch', (t) => {
  const state = s({
    a: 'its text',
    b: 'its field2',
    somefield: '$root.a'
  })
  const app = render(
    {
      text: 'app',
      xxx: {
        tag: 'ul',
        $: 'somefield.$switch',
        $switch: (state) => state.key,
        properties: {
          a: { tag: 'li', text: { $: true, $add: ' haha a' } },
          b: { tag: 'li', text: { $: true, $add: ' haha b' } }
        }
      }
    },
    state
  )

  global.state = state

  if (document.body) {
    document.body.appendChild(app)
  }

  state.resubscribe()

  t.end()
})
