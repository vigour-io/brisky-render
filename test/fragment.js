'use strict'
const render = require('../render')
const test = require('tape')
// const parse = require('parse-element')
const s = require('vigour-state/s')
// const strip = require('vigour-util/strip/formatting')
// const Element = require('../lib/element')

test('fragment', function (t) {
  const state = global.state = s()

  const types = {
    fragment: {
      tag: 'fragment',
      $: 'lulz',
      text: '-----------'
      // a: { text: 'hello' },
      // b: { text: 'blurgh' },
      // c: { text: { $: true } },
      // footer: { type: 'text', val: '----------' }
    }
  }

  const app = render(
    {
      types,
      holder: {
        $: 'lol',
        frag: { type: 'fragment' },
        statics: {
          text: 'its static!'
        }
      },
      text: 'yo'
    },
    state
  )

  setTimeout(function () {
    state.set({
      lol: {
        lulz: 'lulz!'
      }
    })
  }, 500)

  document.body.appendChild(app)

  setTimeout(function () {
    console.log('remove fragment!')
    state.lol.lulz.remove()
  }, 1000)

  setTimeout(function () {
    console.log('readd lol')
    state.set({
      lol: {
        lulz: 'lulz!'
      }
    })
  }, 1500)

  t.end()
})
