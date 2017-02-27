const { render } = require('../')
const test = require('tape')
const { create: s } = require('brisky-struct')
const p = require('parse-element')

// test('subscribe - merge', t => {
//   const state = s({
//     field: 'its text'
//   })
//   const app = render(
//     {
//       text: { $: 'field' },
//       a: { tag: 'a', $: 'field' }
//     },
//     state
//   )
//   t.equal(p(app), '<div>its text<a></a></div>', 'initial')
//   state.field.set('update')
//   t.equal(p(app), '<div>update<a></a></div>', 'fires update')
//   t.end()
// })

test('subscribe - object subscription', t => {
  const state = s({
    // x: {
      a: 'its a ',
      b: 'its b ',
      val: 'bla',
      fields: {
        a: {
          title: 'its fields.a '
        }
      }
    // }
  })
  const app = render({
    text: {
      $: {
        a: { val: true },
        b: { val: true }
      },
      $transform: (val, state) => {
        console.log('---->', state)
        return state.get('a').compute() + ':' + state.get('b').compute()
      }
      }
  }, state, (subs) => {
    // console.log(subs)
  })
  t.equal(p(app), '<div>bla</div>', 'initial subs')
  state.a.set('haha a ')
  t.equal(p(app), '<div>bla</div>', 'update a')
  t.end()
})

// test('subscribe - object subscription', t => {
//   const state = s({
//     a: 'its text',
//     b: 'its also text',
//     fields: {
//       a: {
//         title: 'its fields a'
//       }
//     }
//   })
//   const app = render({
//     flups: {
//       html: {
//         $: {
//           fields: {
//             $any: {
//               title: {
//                 val: true
//               }
//             }
//           },
//           a: { val: true },
//           b: { val: true }
//         }
//       }
//     },
//     field: {
//       text: { $: 'a' }
//     }
//   }, state, (subs) => {
//     // console.log(subs)
//   })
//   t.equal(p(app), '<div><div>its also text</div><div>its text</div></div>', 'initial subs')
//   state.a.set('haha a')
//   t.equal(p(app), '<div><div>haha a</div><div>haha a</div></div>', 'update a')
//   state.b.set('haha b')
//   t.equal(p(app), '<div><div>haha b</div><div>haha a</div></div>', 'update b')
//   state.fields.a.title.set('x')
//   t.equal(p(app), '<div><div>x</div><div>haha a</div></div>', 'update fields a title')
//   // do we need to scope it to state? first commmon ancestor where the object enters?
//   // will add an if in the render thats a bit nasty - but nessecary
//   if (global.document && global.document.body) {
//     global.document.body.appendChild(app)
//   }
//   t.end()
// })

// test('subscribe - object subscription + context', t => {
//   const state = s({
//     fields: {
//       a: {
//         a: 'its fields a',
//         b: {
//           val: 'BBBBBBB',
//           c: {
//             val: ' YO ',
//             d: { val: 'd!', color: 'red', 'w': '10px' }
//           }
//         },
//         c: 'c on a'
//       }
//     },
//     page: {
//       current: [ '@', 'root', 'fields', 'a' ]
//     }
//   })

//   // and property ofc
//   const app = render({
//     bla: {
//       $: 'page.current.$switch',
//       $switch: (state) => 'bla',
//       props: {
//         bla: {
//           tag: 'bla',
//           $: {
//             // val: 1,
//             b: { c: { d: true, val: true }, val: true }, // branches need to be taken into account :/
//             x: { val: 'switch' },
//             a: true,
//             c: true
//           },
//           text: '?',
//           bla: {
//             text: 'BLA',
//             style: {
//               border: {
//                 $: {
//                   w: true,
//                   color: true
//                 },
//                 $transform: (val, state) => `${
//                   state.parent().w.compute()
//                 } solid ${
//                   state.parent().color.compute()
//                 }`
//               }
//             }
//           },
//           more: {
//             tag: 'more',
//             // text is hard need to know if it does not exist...
//             text: { $: true }
//           }
//         }
//       }
//     }
//   }, state)

//   state.fields.a.b.c.d.color.set('purple')

//   t.equal(p(app), '<div><bla>?<div style="border: 10px solid purple;">BLA</div><more>d!</more></bla></div>')

//   if (global.document && global.document.body) {
//     global.document.body.appendChild(app)
//   }
//   t.end()
// })
