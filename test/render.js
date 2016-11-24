'use strict'
const render = require('../render')
const test = require('tape')
const s = require('brisky-struct')
const p = require('parse-element')

test('render - $any on top', (t) => {
  const state = s([ 1, 2 ])
  const app = render(
    {
      $: '$any',
      tag: 'ul',
      props: {
        default: {
          tag: 'li',
          text: { $: true }
        }
      }
    },
    state
  )
  t.equal(p(app), '<ul><li>1</li><li>2</li></ul>', 'initial')
  t.end()
})

// test('render - $switch on top', (t) => {
//   const state = s({
//     text: ':/',
//     html: ':)'
//   })
//   const app = render(
//     {
//       $: 'a.$switch',
//       $switch: (state) => state.key,
//       properties: {
//         text: { type: 'text', $: true },
//         html: { type: 'element', html: { $: true } }
//       }
//     },
//     state
//   )
//   t.equal(p(app), '<div></div>', 'initial')
//   t.ok('a' in state, 'created field on init')
//   state.a.set('$root.text')
//   t.equal(p(app), '<div>:/</div>', 'swtich')
//   state.a.set('$root.html')
//   t.equal(p(app), '<div><div>:)</div></div>', 'change reference')
//   t.end()
// })
