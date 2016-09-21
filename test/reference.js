'use strict'
const render = require('../render')
const test = require('tape')
const parse = require('parse-element')
const strip = require('vigour-util/strip/formatting')
const s = require('vigour-state/s')

test('basic - reference change', function (t) {
  const state = s({
    holder: {
      fields: {
        thing: 1
      },
      fields2: {
        thing: 2
      },
      current: '$root.holder.fields'
    }
  })

  var app = render({
    $: 'holder.current',
    page: {
      $: 'thing',
      text: { $: true }
    }
  }, state)

  t.same(
    parse(app),
    strip(`
      <div>
        <div>1</div>
      </div>
    `)
  )

  state.holder.current.set(state.holder.fields2)

  t.same(
    parse(app),
    strip(`
      <div>
        <div>2</div>
      </div>
    `)
  )

  t.end()
})