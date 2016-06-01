'use strict'
// const render = require('../render')
const test = require('tape')
// const parseElement = require('parse-element')
// const s = require('vigour-state/s')
const Element = require('../lib/element')

test('context', function (t) {
  // const state = s({ text: 'some text' })
  const types = {
    collection: {
      $: 'collection.$any'
    },
    switcher: {
      $: 'navigation.$switch',
      $switch: (state) => state.key
    }
  }

  const app = new Element({
    types,
    collection: {
      type: 'collection',
      $: 'text',
      text: { $: true }
    },
    switcher: {
      type: 'switcher',
      $: 'text',
      text: { $: true }
    }
  })

  t.equal(app.collection.$any, null, 'remove $any by change of subscription on instance')
  t.equal(app.switcher.$switch, null, 'remove $switch by change of subscription on instance')

  t.end()
})
