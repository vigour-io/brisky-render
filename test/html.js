'use strict'
const render = require('../render')
const test = require('tape')
const parse = require('parse-element')
const s = require('vigour-state/s')

test('html', function (t) {
  const state = s({ text: 'some text' })
  t.equal(
    parse(render({ html: '<p>html</p>' })),
    '<div><p>html</p></div>',
    'static html'
  )

  const app = render(
    {
      types: {
        thing: {
          tag: 'p',
          state: {
            html: {
              $: 'text',
              $transform: (val) =>
                typeof val === 'object' ? '' : `<b>${val}</b>`
            }
          },
          static: {
            html: '<p>static</p>'
          }
        }
      },
      something: { type: 'thing' }
    },
    state
  )

  t.equal(
    parse(app),
    '<div><p><div><b>some text</b></div><div><p>static</p></div></p></div>',
    'state and static html as a component'
  )

  state.text.remove()

  t.equal(
    parse(app),
    '<div><p><div></div><div><p>static</p></div></p></div>',
    'removed text'
  )

  t.end()
})
