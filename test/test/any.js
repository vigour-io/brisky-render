'use strict'
const render = require('../../render')
const test = require('tape')
const parse = require('parse-element')
const s = require('vigour-state/s')
const strip = require('vigour-util/strip/formatting')

test('$test - $any', function (t) {
  const state = s({
    fields: {
      items: [ 1, 2 ]
    },
    title: 'hello',
    nav: '$root.fields'
  })

  var app = render({
    switcher: {
      $: 'nav.$switch',
      tag: 'fragment',
      properties: {
        fields: {
          $: 'items.$any',
          child: { text: '(｀^´)' }
        },
        title: { text: 'ಠ_ರೃ' }
      }
    }
  }, state)

  t.same(
    parse(app),
    strip(`
      <div>
        <div>
          <div>(｀^´)</div>
          <div>(｀^´)</div>
        </div>
      </div>
    `),
    'set switcher'
  )

  state.nav.set('$root.title')

  t.same(
    parse(app),
    strip(`
      <div>
        <div>
          ಠ_ರೃ
        </div>
      </div>
    `),
    'set switcher'
  )

  t.end()
})

test('$test - any - reference change', function (t) {
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
