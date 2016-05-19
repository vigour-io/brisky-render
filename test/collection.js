'use strict'
const render = require('../render')
const test = require('tape')

test('collection', function (t) {
  // types
  var app = {
    holder: {
      $: 'collection.$any',
      Child: {
        tag: 'span',
        title: { $: 'title' }
      }
    }
  }
  console.log(render(app, {
    collection: [
      { title: 'a' },
      { title: 'b' }
    ]
  })).toString()
})
