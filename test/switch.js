'use strict'
const render = require('../render')
const test = require('tape')
const parse = require('parse-element')
const s = require('vigour-state/s')
const strip = require('vigour-util/strip/formatting')

test('switch - branch', function (t) {
  const state = s({ field: { navigation: {} } })

  var app = render(
    {
      holder: {
        tag: 'holder',
        switcher: {
          tag: 'switcher',
          $: 'field.navigation.$switch',
          $switch: (state) => state.key,
          properties: {
            first: {
              tag: 'first',
              text: { $: 'title' }
            },
            second: {
              tag: 'second',
              text: { $: 'rating' }
            }
          }
        }
        // THIS BREAKS ORDER FIX IT!
        // second: {
        //   tag: 'second',
        //   $: 'field',
        //   switcher: {
        //     // $: 'navigation.$switch',
        //     // $switch: (state) => state.key
        //   }
        // }
        // in here it breaks
      },
      holder2: {
        tag: 'holder2',
        $: 'field'
        // switcher: {
          // $: 'navigation.$switch',
          // $switch: (state) => state.key
        // }
      }
    },
    state
  )

  t.equal(
    parse(app),
    strip(`
      <div>
        <holder>
          <switcher></switcher>
        </holder>
        <holder2></holder2>
      </div>
    `),
    'intial'
  )

  state.set({
    items: {
      first: { title: 'first' },
      second: { rating: 100 }
    },
    field: {
      navigation: '$root.items[0]'
    }
  })

  t.equal(
    parse(app),
    strip(`
      <div>
        <holder>
          <switcher>
            <first>first</first>
          </switcher>
        </holder>
        <holder2></holder2>
      </div>
    `),
    'switch navigation to items[0]'
  )

  state.field.navigation.set('$root.items[-1]')
  t.equal(
    parse(app),
     strip(`
      <div>
        <holder>
          <switcher>
            <second>100</second>
          </switcher>
        </holder>
        <holder2></holder2>
      </div>
    `),
    'switch navigation to items[1]'
  )
  t.end()
})
