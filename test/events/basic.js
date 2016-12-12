const render = require('../../render')
const element = require('../../lib/element')
const test = require('tape')
const trigger = require('../../trigger')
const isNode = typeof window === 'undefined'

test('events - basic - add events', (t) => {
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

test('events - basic - prevent', (t) => {
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

test('basic - up, move, down', (t) => {
  const cases = {
    move: [ 'mousemove', 'touchmove' ],
    down: [ 'mousedown', 'touchstart' ],
    up: [ 'mouseup', 'touchend' ]
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

// test('basic - remove', (t) => {
//   var remove = 0
//   var create = 0
//   const elem = new Element({
//     types: {
//       simple: {
//         on: { down () {} }
//       },
//       custom: {
//         on: {
//           properties: {
//             hello: {
//               createEvent () {
//                 create++
//               },
//               removeEvent () {
//                 remove++
//               }
//             }
//           },
//           hello () {}
//         }
//       }
//     },
//     a: {
//       type: 'simple',
//       on: null
//     },
//     b: {
//       type: 'simple',
//       on: {
//         down: null
//       }
//     },
//     c: {
//       type: 'simple',
//       on: {
//         up: true,
//         down: null
//       }
//     },
//     d: {
//       type: 'custom',
//       on: {
//         hello: null
//       }
//     },
//     e: {
//       type: 'custom',
//       on: {
//         field: {}
//       }
//     }
//   })
//   t.equal(elem.a.hasEvents, null, 'removed hasEvents from "elem.a"')
//   t.equal(elem.b.hasEvents, null, 'removed hasEvents from "elem.b"')
//   t.ok(elem.c.hasEvents !== null, '"elem.c" has events')
//   t.equal(remove, 1, 'fired removeEvent for custom event')
//   t.equal(create, 1, 'fired createEvent for custom event')
//   t.equal(elem.b.hasEvents, null, 'removed hasEvents from "elem.e"')
//   t.end()
// })

// test('remove - fire events for context', function (t) {
//   let count = 0
//   const app = render({
//     types: {
//       a: {
//         nested: {},
//         on: {
//           mousedown: () => count++
//         }
//       }
//     },
//     a: { type: 'a' },
//     b: { type: 'a', nested: null }
//   })

//   if (!isNode) {
//     document.body.appendChild(app)
//   }

//   trigger(app.childNodes[0], 'mousedown')
//   t.equal(count, 1, 'fired for a')
//   trigger(app.childNodes[1], 'mousedown')
//   t.equal(count, 2, 'fired for b')

//   t.end()
// })
