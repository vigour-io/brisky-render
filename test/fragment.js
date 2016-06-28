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

  state.set({
    b: 'its b!'
  })

  if ('body' in document) {
    document.body.appendChild(app)
  }

  setTimeout(function () {
    console.log('remove fragment!')
    // need to remove all children...
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
