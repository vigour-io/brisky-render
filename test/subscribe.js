const render = require('../render')
const test = require('tape')
const s = require('brisky-struct')
const p = require('parse-element')

test('subscribe - merge', t => {
  const state = s({
    field: 'its text'
  })
  const app = render(
    {
      text: { $: 'field' },
      a: { tag: 'a', $: 'field' }
    },
    state
  )
  t.equal(p(app), '<div>its text<a></a></div>', 'initial')
  state.field.set('update')
  t.equal(p(app), '<div>update<a></a></div>', 'fires update')
  t.end()
})

// test('subscribe - resubscribe', (t) => {
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
//   state.field.set('update')
//   t.equal(p(app), '<div>update<a></a></div>', 'fires update')
//   state.field.val = 'silent update'
//   state.resubscribe()
//   t.equal(p(app), '<div>silent update<a></a></div>', 'fires silent update')
//   t.end()
// })

// test('subscribe - resubscribe - switch', (t) => {
//   const state = s({
//     a: 'its text',
//     b: 'its field2',
//     somefield: '$root.a'
//   })
//   const app = render({
//     text: 'app',
//     xxx: {
//       tag: 'ul',
//       $: 'somefield.$switch',
//       $switch: (state) => state.key,
//       properties: {
//         a: { tag: 'li', text: { $: true, $add: ' haha a' } },
//         b: { tag: 'li', text: { $: true, $add: ' haha b' } }
//       }
//     }
//   }, state)
//   // state.resubscribe()
//   // t.equal(p(app), '<div>app<ul><li>its text haha a</li></ul></div>')
//   t.end()
// })

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
//   // will add an if in the render thats a bit nasty
//   if (global.document && global.document.body) {
//     global.document.body.appendChild(app)
//   }
//   t.end()
// })
