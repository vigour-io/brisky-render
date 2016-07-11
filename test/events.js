'use strict'
const test = require('tape')
const render = require('../render')
const s = require('vigour-state/s')
const Element = require('../')

test('events', (t) => {
  const state = s({ something: true })
  const elem = new Element({
    node: {
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

test('events - reference', (t) => {
  const state = s({
    a: { field: true },
    b: { field: true },
    something: '$root.a'
  })
  const elem = new Element({
    node: {
      $: 'something',
      field: {
        $: 'field',
        define: { hasEvents: true }
      }
    }
  })
  const app = render(elem, state)
  t.equal(app.childNodes[0].childNodes[0]._s, state.a.field, 'correct state on node')

  console.log('lets go')
  state.something.set('$root.b')
  t.equal(app.childNodes[0].childNodes[0]._s, state.b.field, 'correct state on node after set')
  t.end()
})
