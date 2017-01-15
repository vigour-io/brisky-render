const test = require('tape')
const { render, attr } = require('../../')
const { create: s } = require('brisky-struct')
const p = require('parse-element')

// test('state', t => {
//   var elem, attr1, attr2
//   elem = render({
//     attr: {
//       someattribute: {
//         $: 'someValue'
//       }
//     }
//   }, {
//     someValue: 'foo'
//   })

//   attr1 = elem.getAttribute('someattribute')
//   if (!attr1) {
//     t.fail('no attribute')
//   } else {
//     t.ok(attr1 === 'foo', 'simple attribute')
//   }
//   elem = render({
//     attr: {
//       someattribute: {
//         $: 'someValue'
//       },
//       anotherattribute: {
//         $: 'anotherValue'
//       }
//     }
//   }, {
//     someValue: 'foo',
//     anotherValue: 'bar'
//   })
//   attr1 = elem.getAttribute('someattribute')
//   attr2 = elem.getAttribute('anotherattribute')
//   if (!attr1 || !attr2) {
//     t.fail('no attributes')
//   } else {
//     t.ok(attr1 === 'foo' && attr2 === 'bar', 'multiple attributes')
//   }
//   elem = render({
//     attr: {
//       someattribute: { $: 'someValue' },
//       anotherattribute: 'bar'
//     }
//   }, { someValue: 'foo' })
//   attr1 = elem.getAttribute('someattribute')
//   attr2 = elem.getAttribute('anotherattribute')
//   if (!attr1 || !attr2) {
//     t.fail('no attributes')
//   } else {
//     t.ok(
//       attr1 === 'foo' && attr2 === 'bar',
//       'mixed state and static attributes'
//     )
//   }
//   t.end()
// })

// test('state - src', t => {
//   const state = s({
//     thumb: 'cat.jpg'
//   })
//   const app = render({
//     img: {
//       tag: 'img',
//       attr: {
//         src: { $: 'thumb' }
//       }
//     }
//   }, state)
//   var src = app.childNodes[0].getAttribute('src')
//   t.equal(src, 'cat.jpg', 'initial')
//   state.thumb.set(null)
//   src = app.childNodes[0].getAttribute('src')
//   t.equal(src, null, 'remove thumb')
//   state.set({ thumb: 'x' })
//   if ('body' in document) {
//     t.equal(p(app), '<div><img src="x"></div>', 'type slider (type override)')
//     state.set({ thumb: 'y' })
//     t.equal(p(app), '<div><img src="y"></div>', 'type slider (type override)')
//     state.set({ thumb: void 0 })
//     t.equal(p(app), '<div><img></div>', 'type slider (type override)')
//   } else {
//     t.equal(p(app), '<div><img src="x"></img></div>', 'type slider (type override)')
//     state.set({ thumb: 'y' })
//     t.equal(p(app), '<div><img src="y"></img></div>', 'type slider (type override)')
//     state.set({ thumb: void 0 })
//     t.equal(p(app), '<div><img></img></div>', 'type slider (type override)')
//   }
//   t.end()
// })

// test('state - value', t => {
//   const state = s({
//     rating: '10'
//   })
//   const app = render({
//     slider: {
//       tag: 'input',
//       attr: {
//         type: 'slider',
//         value: {
//           $: 'rating'
//         }
//       }
//     }
//   }, state)
//   t.equal(p(app), '<div><input type="slider"></div>', 'type slider (type override)')
//   t.same(app.childNodes[0].value, '10', 'has correct initial value')
//   state.rating.set(null)
//   t.equal(app.childNodes[0].value, '', 'remove rating') // need to verify in the browser
//   t.end()
// })

// test('state - gaurd against too many updates', t => {
//   var cntRender = 0
//   var cnt = 0
//   const propRender = attr.props.attr.props.default.render.state
//   const state = s()
//   const app = render({
//     attr: {
//       selected: {
//         define: {
//           render: {
//             state (target, state, type, subs, tree, id, pid) {
//               cntRender++
//               return propRender.call(this, target, state, type, subs, tree, id, pid)
//             }
//           }
//         },
//         $: 'select'
//       }
//     }
//   }, state)

//   const sa = app.setAttribute
//   app.setAttribute = function () {
//     cnt++
//     return sa.apply(this, arguments)
//   }
//   state.set({ select: false })
//   state.select.emit('data')

//   t.same(cntRender, 2, 'boolean - fires render twice')
//   t.same(cnt, 1, 'boolean - fires attribute once')

//   cntRender = 0
//   cnt = 0
//   state.set({ select: 1 })
//   state.select.emit('data')

//   t.same(cntRender, 2, 'number - fires render twice')
//   t.same(cnt, 1, 'number - fires attribute once')

//   t.end()
// })
