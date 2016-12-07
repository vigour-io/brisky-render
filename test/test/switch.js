const render = require('../../render')
const test = require('tape')
const parse = require('parse-element')
const s = require('brisky-struct')
const strip = require('strip-formatting')

test('$switch (test) - $switch', t => {
  const state = s({
    field: { first: true },
    lulz: true,
    bla: true,
    navigation: {}
  })

  var app = render({
    switcher: {
      $: 'navigation.$switch',
      $switch: (state) => state.origin().key,
      props: {
        field: {
          tag: 'field',
          first: {
            tag: 'first',
            $: 'first.$switch',
            $switch: (state) => state && state.compute() === true
          }
        },
        lulz: {
          tag: 'lulz',
          $: 'root.bla.$switch',
          $switch: (state) => state && state.compute() === true
        }
      }
    }
  }, state)

  t.same(
    parse(app),
    '<div></div>',
    'correct html on intial state'
  )

  state.navigation.set([ '@', 'root', 'field' ])

  t.same(
    parse(app),
    strip(`
      <div>
        <field>
          <first></first>
        </field>
      </div>
    `),
    'set switcher'
  )

  state.navigation.set([ '@', 'root', 'lulz' ])

  t.same(
    parse(app),
    strip(`
      <div>
        <lulz></lulz>
      </div>
    `),
    'switch to other property'
  )

  t.end()
})
