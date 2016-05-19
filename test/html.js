'use strict'
const render = require('../render')
const test = require('tape')
const parseElement = require('parse-element')
const s = require('vigour-state/s')

test('html', function (t) {
  const state = s({ text: 'some text' })
  t.equal(
    parseElement(render({ html: '<p>html</p>' })),
    '<div><p>html</p></div>',
    'static html'
  )

  const app = render(
    {
      components: {
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
    parseElement(app),
    '<div><p><div><b>some text</b></div><div><p>static</p></div></p></div>',
    'state and static html as a component'
  )

  state.text.remove()

  t.equal(
    parseElement(app),
    // div has to be parsed correctly
    '<div><p><div/><div><p>static</p></div></p></div>',
    'removed text'
  )

  t.end()
})
