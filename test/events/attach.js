'use strict'
const render = require('brisky-core/render')
const Element = require('brisky-core')
const test = require('tape')
const trigger = require('../trigger')
const Event = global.Event
const attach = require('../lib/attach')
const isNode = require('vigour-util/is/node')

Element.prototype.inject(
  require('../lib'),
  require('../lib/basic')
)

test('attach - position', (t) => {
  var result, upResult
  const app = render({
    a: {
      on: {
        down (event) {
          result = event
        },
        up (event) {
          upResult = event
        }
      }
    }
  })
  if (!isNode) {
    document.body.appendChild(app)
  }

  const event = new Event('mousedown', { bubbles: true })
  event.clientX = 1
  event.clientY = 0
  trigger(app.childNodes[0], event)

  t.same(result, {
    target: app.childNodes[0],
    x: 1,
    y: 0,
    event: event
  }, 'correct event object')

  const event2 = new Event('mouseup', { bubbles: true })
  event2.clientX = 100
  event2.clientY = 100
  attach(event2, result)
  t.same(result, {
    target: app.childNodes[0],
    x: 100,
    y: 100,
    prevX: 1,
    prevY: 0,
    event: event2
  }, 'correct event extended event object')

  const event3 = new Event('mouseup', { bubbles: true })
  event3.clientX = 1
  event3.clientY = 0
  trigger(app.childNodes[0], event3)
  attach.start(upResult)
  t.same(upResult, {
    target: app.childNodes[0],
    x: 1,
    y: 0,
    startX: 1,
    startY: 0,
    event: event3
  }, 'correct upResult object, using attach.start')
  t.end()
})
