'use strict'
const render = require('../../render')
const test = require('tape')
const parse = require('parse-element')
const s = require('vigour-state/s')
const strip = require('vigour-util/strip/formatting')

test('order - basic', function (t) {
  const state = s()
  const app = render(
    {
      1: { $: 1, text: { $: true } },
      2: { $: 2, text: { $: true } },
    },
    state
  )

  console.log('----- set second -----')
  state.set({
    2: 2
  })

  setTimeout(function () {
    console.log('----- set first -----')
    state.set({
      1: 1
    })
  }, 500)

  document.body.appendChild(app)

  t.end()
})
