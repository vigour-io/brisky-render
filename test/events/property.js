'use strict'
const test = require('tape')
const render = require('brisky-core/render')
const s = require('vigour-state/s')
const Element = require('brisky-core')

test('property', (t) => {
  const state = s({ something: true })
  const elem = new Element({
    node: {
      $: 'something',
      hasEvents: true
    }
  })
  const app = render(elem, state)
  t.equal(app.childNodes[0]._, elem.node, 'correct _ on node')
  t.equal(app.childNodes[0]._s, state.something, 'correct state on node')
  t.end()
})

test('property - deep', (t) => {
  const state = s({ something: true })
  const elem = new Element({
    node: {
      $: 'something',
      hello: {
        bla: {
          $: true,
          hasEvents: true
        }
      }
    }
  })
  const app = render(elem, state)
  t.equal(app.childNodes[0].childNodes[0].childNodes[0]._, elem.node.hello.bla, 'correct _ on node')
  t.equal(app.childNodes[0].childNodes[0].childNodes[0]._s, state.something, 'correct state on node')
  t.end()
})

test('property - reference', (t) => {
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
        hasEvents: true
      }
    }
  })
  const app = render(elem, state)
  t.equal(app.childNodes[0].childNodes[0]._s, state.a.field, 'correct state on node')
  state.something.set('$root.b')
  t.equal(app.childNodes[0].childNodes[0]._s, state.b.field, 'correct state on node after set')
  t.end()
})
