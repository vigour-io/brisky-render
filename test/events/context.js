'use strict'
const render = require('brisky-core/render')
const Element = require('brisky-core')
const test = require('tape')
const s = require('vigour-state/s')
const trigger = require('../trigger')
const isNode = require('vigour-util/is/node')

Element.prototype.inject(
  require('../lib'),
  require('../lib/basic')
)

test('context - fire events - restore context', function (t) {
  const state = s({
    clients: {
      child: {
        cool: true
      },
      a: {
        text: 'a'
      },
      b: {
        text: 'b'
      }
    }
  })
  const app = render({
    types: {
      a: {
        $: 'clients.a.cool',
        text: { $: 'text' },
        on: {
          down (event, stamp) {
            t.equal(
              'state' in event,
              true,
              `has state in event for "${this.key}"`
            )
            t.same(
              event.state.path(),
              [ 'clients', this.key, 'cool' ],
              `correct path for "${this.key}"`
            )
            event.state.set(false)
          }
        }
      }
    },
    a: { type: 'a' },
    b: { type: 'a', $: 'clients.b.cool' }
  }, state)

  if (!isNode) {
    document.body.appendChild(app)
  }

  t.same(
    app.childNodes[0]._sc,
    state.clients.a.cool.storeContext(),
    'has stored context on node "a"'
  )
  trigger(app.childNodes[0], 'mousedown')
  t.equal(app.childNodes[0]._sc, void 0, 'cleared stored context on node')
  t.same(
    app.childNodes[1]._sc,
    state.clients.b.cool.storeContext(),
    'has stored context on node "b"'
  )
  trigger(app.childNodes[1], 'touchstart')
  t.equal(app.childNodes[1]._sc, void 0, 'cleared stored context on node')
  t.end()
})

test('context - top level change', function (t) {
  const state = s({
    child: {
      things: {
        are: {
          good: true
        }
      }
    },
    a: {}
  })
  const app = render({
    field: {
      $: 'a.things.are.good',
      on: {
        down () {}
      }
    }
  }, state)

  if (!isNode) {
    document.body.appendChild(app)
  }

  t.same(
    app.childNodes[0]._sc,
    state.a.things.are.good.storeContext(),
    'correct stored context'
  )
  state.a.things.set('lulz')
  trigger(app.childNodes[0], 'mousedown')
  t.same(
    app.childNodes[0]._sc,
    state.a.things.are.good.storeContext(),
    'correct stored context after top level context resolve'
  )
  t.same(
    app.childNodes[0]._s,
    state.a.things.are.good,
    'correct state after top level context resolve'
  )

  state.a.remove()
  trigger(app.childNodes[0], 'mousedown')

  t.same(
    app.childNodes[0]._s,
    null,
    'correct stored context after top level context remove'
  )
  t.end()
})
