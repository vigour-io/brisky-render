const { render, element } = require('../../')
const test = require('tape')
const trigger = require('../../trigger')
const isNode = typeof window === 'undefined'

test('events - basic - add events', t => {
  const elem = element.create({
    isWidget: true,
    on: { mousedown () {} }
  })
  const node = render(elem)
  t.true(elem.hasEvents, 'adds hasEvents on element')
  t.equals(node._, elem, 'stores element on node')
  t.false('_s' in node, 'doesn\'t store state on node when no state')
  t.end()
})

test('events - basic - prevent', t => {
  const elem = {
    style: {
      fontFamily: 'BlinkMacSystemFont',
      fontSize: '30px'
    },
    on: {
      mousedown () {
        t.fail('should be prevented')
      }
    },
    nest: {
      html: 'hello',
      on: {
        mousedown (event) {
          event.prevent = true
        }
      }
    }
  }
  const app = render(elem)
  if (!isNode) {
    document.body.appendChild(app)
  }
  trigger(app.childNodes[0], 'mousedown')
  t.ok('prevent events')
  t.end()
})

test('basic - up, move, down', t => {
  const cases = {
    move: [ 'mousemove' ], // 'touchmove'
    down: [ 'mousedown' ], // 'touchstart'
    up: [ 'mouseup' ] // 'touchend'
  }
  for (let type in cases) {
    let cnt = 0
    let app = render({
      on: { [type] () {
        cnt++
      }}
    })
    if (!isNode) {
      document.body.appendChild(app)
    }
    for (let i in cases[type]) {
      trigger(app, cases[type][i])
    }
    t.equal(cnt, cases[type].length, `fired for each sub-type "${type}"`)
  }
  t.end()
})
