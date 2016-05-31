'use strict'
const render = require('../render')
const test = require('tape')
const parse = require('parse-element')
const s = require('vigour-state/s')

test('switch - branch', function (t) {
  const state = s({ navigation: {} })

  var app = render(
    {
      holder: {
        tag: 'holder',
        $: 'navigation.$switch',
        $switch (state, type, stamp, subs, tree, sType) {
          console.log('lullzors', state.key)
          return state.key
        },
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
    },
    state
  )

  t.equal(parse(app), '<div><holder></holder></div>', 'intial')

  state.set({
    items: {
      first: { title: 'first' },
      second: { rating: 100 }
    },
    navigation: '$root.items[0]'
  })

  t.equal(
    parse(app),
    '<div><holder><first>first</first></holder></div>',
    'switch navigation to items[0]'
  )

  state.navigation.set('$root.items[-1]')
  t.equal(
    parse(app),
    '<div><holder><second>100</second></holder></div>',
    'switch navigation to items[1]'
  )
  t.end()
})
