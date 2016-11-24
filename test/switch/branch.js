'use strict'
const render = require('../../render')
const test = require('tape')
const parse = require('parse-element')
const s = require('brisky-struct')
const strip = require('strip-formatting')

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
        },
        second: {
          tag: 'switchsecond',
          $: 'field',
          switcher: {
            tag: 'switcher',
            $: 'navigation.$switch',
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
        }
      },
      holder2: {
        tag: 'holder2',
        $: 'field',
        field: {
          $: 'navigation',
          switcher: {
            tag: 'switcher',
            $: '$switch',
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
        }
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
          <switchsecond>
            <switcher></switcher>
          </switchsecond>
        </holder>
        <holder2>
          <div>
          <switcher></switcher>
          </div>
        </holder2>
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
          <switchsecond>
            <switcher>
              <first>first</first>
            </switcher>
          </switchsecond>
        </holder>
        <holder2>
          <div>
          <switcher>
            <first>first</first>
          </switcher>
          </div>
        </holder2>
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
          <switchsecond>
            <switcher>
              <second>100</second>
            </switcher>
          </switchsecond>
        </holder>
        <holder2>
          <div>
          <switcher>
            <second>100</second>
          </switcher>
          </div>
        </holder2>
      </div>
    `),
    'switch navigation to items[1]'
  )
  t.end()
})
