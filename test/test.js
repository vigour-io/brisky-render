'use strict'
const render = require('../render')
const test = require('tape')

test('test/condition', function (t) {
  var elem = render({
    holder: {
      $: 'collection.$any',
      child: {
        $: '$test',
        $test: {
          val (state) {
            return state.title.compute() === 'a'
          },
          $: {
            title: {}
          }
        }
      }
    }
  }, {
    collection: [
      { title: 'a' },
      { title: 'b' },
      { title: 'c' }
    ]
  })

  t.equal(
    elem.childNodes[0].childNodes.length,
    1,
    'simple test collection + test'
  )

  elem = render({
    $: 'thing',
    item: {
      $: '$test',
      $test: {
        val (state) {
          return state.title.compute() === 'a'
        },
        $: {
          title: {}
        }
      }
    }
  }, {
    thing: { title: 'a' }
  })

  t.equal(
    elem.childNodes.length,
    1,
    'simple test'
  )

  elem = render({
    item: {
      $: 'nested.thing.$test',
      $test: {
        val (state) {
          return state.title.compute() === 'a'
        },
        $: {
          title: {}
        }
      }
    }
  }, {
    nested: {
      thing: { title: 'a' }
    }
  })

  t.equal(
    elem.childNodes.length,
    1,
    'simple test nested'
  )

  t.end()
})
