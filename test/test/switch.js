'use strict'
const render = require('../../render')
const test = require('tape')
const parse = require('parse-element')
const s = require('brisky-struct')
const strip = require('vigour-util/strip/formatting')

test('$test - $switch', function (t) {
  const state = s({
    field: { first: true },
    lulz: true,
    bla: true,
    navigation: {}
  })

  var app = render({
    switcher: {
      tag: 'switcher',
      $: 'navigation.$switch',
      $switch: (state) => state.key,
      properties: {
        field: {
          tag: 'field',
          first: {
            tag: 'first',
            $: 'first.$test',
            $test: (state) => state && state.compute() === true
          }
        },
        lulz: {
          tag: 'lulz',
          $: '$root.bla.$test',
          $test: (state) => state && state.compute() === true
        }
      }
    }
  }, state)

  t.same(
    parse(app),
    '<div><switcher></switcher></div>',
    'correct html on intial state'
  )

  state.navigation.set('$root.field')

  t.same(
    parse(app),
    strip(`
      <div>
        <switcher>
          <field>
            <first></first>
          </field>
        </switcher>
      </div>
    `),
    'set switcher'
  )

  state.navigation.set('$root.lulz')

  t.same(
    parse(app),
    strip(`
      <div>
        <switcher>
          <lulz></lulz>
        </switcher>
      </div>
    `),
    'switch to other property'
  )

  t.end()
})
