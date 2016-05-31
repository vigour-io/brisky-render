'use strict'
const render = require('../../render')
const test = require('tape')
const parse = require('parse-element')
// const strip = require('vigour-util/strip/formatting')
const s = require('vigour-state/s')

test('$test - branch', function (t) {
  var appState
  var app = render({
    holder: {
      $: 'fields',
      first: {
        $: '$test',
        $test: {
          val (state) {
            return 'swiggy' in state && state.swiggy.compute() === true
          },
          $: {
            title: {}
          }
        }
      }
      // second: {
      //   $: '$test',
      //   $test: {
      //     val (state) {
      //       return state.title.compute() === 'a'
      //     },
      //     $: {
      //       title: {}
      //     }
      //   }
      // }
    }
  },
  s({
    fields: {
      swiggy: true
    }
  }),
  (subs) => {
    if (!appState) {
      appState = subs
    }
  })
  console.log(parse(app))
  t.end()
})
