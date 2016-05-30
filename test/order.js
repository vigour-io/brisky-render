'use strict'
const render = require('../render')
const test = require('tape')
const parse = require('parse-element')
const s = require('vigour-state/s')
// const strip = require('vigour-util/strip/formatting')

test('order', function (t) {
  const state = s({ text: 'some text' })
  const app = render(
    {
      hello: {}
    },
    state
  )

  console.log(parse(app))
  t.end()
})
