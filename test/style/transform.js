'use strict'
require('brisky-core').prototype.inject(require('../'))
const test = require('tape')
const s = require('vigour-state/s')
const render = require('brisky-core/render')

test('transform - static', (t) => {
  const elem = render({
    style: {
      transform: {
        y: 10,
        x: 10
      }
    }
  })
  t.equals(elem.style.transform, 'translate3d(10px, 10px, 0px)', 'x and y')
  t.end()
})

test('transform - state', (t) => {
  const state = s({
    x: -5,
    y: 5,
    rot: 5
  })
  const elem = render({
    style: {
      transform: {
        y: { $: 'y' },
        x: { $: 'x' },
        rotate: { $: 'rot' },
        scale: 0.1
      }
    }
  }, state)
  t.equals(elem.style.transform, 'translate3d(-5px, 5px, 0px) scale(0.1) rotate(5deg)', 'mixed state and static')
  t.end()
})

test('transform - state - remove', (t) => {
  const state = s({
    a: {
      y: 5
    },
    b: {},
    field: '$root.a'
  })
  const elem = render({
    field: {
      $: 'field.$switch',
      properties: {
        a: {
          style: {
            transform: {
              y: { $: 'y' }
            }
          }
        }
      }
    }
  }, state)
  t.equals(elem.childNodes[0].childNodes[0].style.transform, 'translate3d(0, 5px, 0px)', 'intial')
  state.set({ field: '$root.b' })
  t.ok(true, 'should not crash on remove')
  t.end()
})
