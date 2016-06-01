'use strict'
const render = require('../../render')
const test = require('tape')
const parse = require('parse-element')
const s = require('vigour-state/s')
const strip = require('vigour-util/strip/formatting')

test('switch - nested', function (t) {
  const state = s({ field: { navigation: {} } })
  var cnt = 0
  const app = render(
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
              nest: {
                tag: 'switchsecond',
                text: { $: 'title' },
                switcher: {
                  tag: 'switcher',
                  $: 'navigation.$switch',
                  $switch: (state) => state.key,
                  properties: {
                    first: {
                      text: { $: 'title' },
                      on: {
                        remove (data) {
                          const node = data.target
                          cnt++
                          node.parentNode.removeChild(node)
                        }
                      }
                    },
                    second: {
                      text: { $: 'rating' }
                    }
                  }
                }
              }
            },
            second: {
              tag: 'second',
              text: { $: 'rating' }
            }
          }
        }
      }
    },
    state
  )

  state.set({
    otheritems: {
      first: { title: 'first' },
      second: { rating: 100 }
    },
    items: {
      first: {
        title: 'first',
        navigation: {}
      },
      second: { rating: 100 }
    },
    field: {
      val: 'blurf',
      navigation: '$root.items[0]'
    }
  })

  if (document.body) {
    document.body.appendChild(app)
  }

  state.items.first.navigation.set('$root.otheritems[0]')
  state.items.first.navigation.set('$root.otheritems[1]')
  t.equal(cnt, 1, 'remove listener fired')
  // state.field.navigation.set('$root.items[-1]')
  t.equal(
    parse(app),
     strip(`
      <div>
        <holder>
          <switcher>
            <first>
              <switchsecond>
                first
                <switcher>
                  <div>100</div>
                </switcher>
              </switchsecond>
            </first>
          </switcher>
        </holder>
      </div>
    `),
    'switch nested switcher to "$root.otheritems[1]"'
  )
  state.field.navigation.set('$root.items[1]')
  t.equal(
    parse(app),
     strip(`
      <div>
        <holder>
          <switcher>
            <second>100</second>
          </switcher>
        </holder>
      </div>
    `),
    'switch switcher to "$root.items[1]"'
  )

  t.end()
})
