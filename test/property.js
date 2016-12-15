'use strict'
import { render } from '../'
import test from 'tape'

test('property - cachedNode + context', t => {
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
    override: {
      type: 'elem', class: 'haha'
    }
  },
  {},
  (s, t, app) => { elem = app })
  t.equal(elem.flurps._class, elem.types.elem._class, 'instance shares _class')
  t.ok('_cachedNode' in elem.override, 'override got own property cachedNode')
  t.end()
})
