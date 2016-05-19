'use strict'
const render = require('../render')
const test = require('tape')
const p = require('parse-element')
const s = require('vigour-state/s')

test('text', function (t) {
  const state = s({ text: 'some text' })
  t.equal(
    p(render({ text: 'hello' })),
    '<div>hello</div>',
    'static text'
  )

  const app = render(
    {
      components: {
        thing: {
          tag: 'p',
          state: {
            text: {
              $: 'text',
              $transform: (val) =>
                typeof val === 'object' ? '' : `-${val}-`
            }
          },
          static: {
            text: 'static'
          }
        }
      },
      something: { type: 'thing' }
    },
    state
  )

  t.equal(
    p(app),
    '<div><p><div>-some text-</div><div>static</div></p></div>',
    'state and static text as a component'
  )

  state.text.remove()

  t.equal(
    p(app),
    '<div><p><div/><div>static</div></p></div>',
    'removed text'
  )

  t.end()
})

test.skip('text - path subscription', function (t) {
  const state = s({
    first: { second: 'a' }
  })

  // add broken operator case and everything
  const app = render({
    text: { $: 'first.second' }
  }, state)

  t.equal(p(app), '<div>a</div>', 'correct html')
  state.first.remove()
  t.equal(p(app), '<div/>', 'removed text')
  t.end()
})
