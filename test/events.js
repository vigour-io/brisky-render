'use strict'
const test = require('tape')
const render = require('../render')
const s = require('vigour-state/s')
const Element = require('../')

test('events', (t) => {
  const state = s({ something: true })
  const elem = new Element({
    node: {
      tag: 'thing',
      $: 'something',
      define: { hasEvents: true }
    }
  })
  const app = render(elem, state)
  t.equal(app.childNodes[0]._, elem.node, 'correct _ on node')
  t.equal(app.childNodes[0]._s, state.something, 'correct state on node')
  t.end()
})

test('events - deep', (t) => {
  const state = s({ something: true })
  const elem = new Element({
    node: {
      tag: 'thing',
      $: 'something',
      hello: {
        bla: {
          define: { hasEvents: true }
        }
      }
    }
  })
  const app = render(elem, state)
  t.equal(app.childNodes[0].childNodes[0].childNodes[0]._, elem.node.hello.bla, 'correct _ on node')
  t.equal(app.childNodes[0].childNodes[0].childNodes[0]._s, state.something, 'correct state on node')
  t.end()
})
