'use strict'
const render = require('../render')
const test = require('tape')

test('property - cachedNode + context', (t) => {
  var elem
  render({
    types: {
      elem: {
        class: {
          type: 'property',
          val: 'balls',
          render: { static () {} }
        }
      }
    },
    flurps: { type: 'elem' },
    override: { type: 'elem', class: 'haha' }
  },
  {},
  (s, t, state, type, stamp, subs, tree, sType, app) => {
    elem = app
  })
  t.equal(elem.flurps._class, elem.types.elem._class, 'instance shares _class')
  t.ok(elem.override.hasOwnProperty('_cachedNode'), 'override got own property cachedNode')
  t.end()
})
