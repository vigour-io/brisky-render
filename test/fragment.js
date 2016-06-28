'use strict'
const render = require('../render')
const test = require('tape')
// const parse = require('parse-element')
const s = require('vigour-state/s')
// const strip = require('vigour-util/strip/formatting')

test('fragment', function (t) {
  const state = global.state = s()

  const types = {
    fragment: {
      tag: 'fragment',
      $: 'lulz',
      b: { text: { $: '$root.b' } },
      static: { text: 'sooo static' },
      c: { text: { $: true, $prepend: 'frag: ' } }
    }
  }

  const app = render(
    {
      types,
      holder: {
        $: 'lol',
        frag: { type: 'fragment' },
        statics: {
          text: '--->its static (from lol)'
        }
      },
      text: 'static under!'
    },
    state
  )

  state.set({
    lol: {
      lulz: 'lulz!'
    }
  })

  setTimeout(() => state.set({ b: 'its b!' }), 500)

  if ('body' in document) {
    document.body.appendChild(app)
  }

  setTimeout(function () {
    state.lol.lulz.remove()
  }, 1000)

  setTimeout(function () {
    state.set({
      lol: { lulz: 'lulz!' }
    })
  }, 1500)

  t.end()
})
