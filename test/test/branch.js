const render = require('../../render')
const test = require('tape')
const parse = require('parse-element')
const s = require('brisky-struct')

test('$switch (test) - branch', t => {
  const state = s({ fields: { first: true } })
  var app = render({
    holder: {
      tag: 'holder',
      $: 'fields',
      first: {
        tag: 'first',
        $: '$switch',
        $switch (state) {
          return 'first' in state &&
            state.first.compute() === true &&
            state.get('second', {}).compute() !== true
        }
      },
      second: {
        tag: 'second',
        $: '$switch',
        $switch (state) {
          return 'second' in state && state.second.compute() === true
        }
      }
    },
    third: {
      tag: 'third',
      $: 'fields.$switch',
      $switch: {
        val (state) {
          const $r = state.root()
          return 'third' in $r && $r.third.compute() === true
        },
        // need to support this syntax
        $: 'root.third'
      }
    }
  }, state)

  t.same(
    parse(app),
    '<div><holder><first></first></holder></div>',
    'correct html on intial state'
  )
  state.fields.set({ first: false })
  t.same(
    parse(app),
    '<div><holder></holder></div>',
    'set state.fields.first to false'
  )
  state.fields.set({ second: true })
  t.same(
    parse(app),
    '<div><holder><second></second></holder></div>',
    'set state.fields.second to true'
  )
  state.fields.set({ first: true })
  t.same(
    parse(app),
    '<div><holder><second></second></holder></div>',
    'set state.fields.first to true, dont show since second is true'
  )
  state.fields.set({ second: false })
  t.same(
    parse(app),
    '<div><holder><first></first></holder></div>',
    'set state.fields.second to false, show first'
  )
  state.set({ third: true })
  t.same(
    parse(app),
    '<div><holder><first></first></holder><third></third></div>',
    'set state.third to true, show third'
  )
  t.end()
})
