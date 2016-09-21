'use strict'
const render = require('../../render')
const test = require('tape')
const parse = require('parse-element')
const strip = require('vigour-util/strip/formatting')
const s = require('vigour-state/s')

test('any - reference change - test', function (t) {
  const state = s({
    holder: {
      fields: {
        items: [ 1, 2 ]
      },
      fields2: {
        items: [ 3, 4 ]
      },
      current: '$root.holder.fields'
    }
  })

  var app = render({
    $: 'holder.current',
    page: {
      $: 'items.$any',
      child: {
        $: '$test',
        $test: val => true,
        text: { $: true }
      }
    }
  }, state)

  t.same(
    parse(app),
    strip(`
      <div>
        <div>
          <div>1</div>
          <div>2</div>
        </div>
      </div>
    `)
  )

  state.holder.current.set(state.holder.fields2)

  t.same(
    parse(app),
    strip(`
      <div>
        <div>
          <div>3</div>
          <div>4</div>
        </div>
      </div>
    `)
  )

  t.end()
})