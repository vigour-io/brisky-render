const { render } = require('../')
const test = require('tape')
const { create: s } = require('brisky-struct')
const p = require('parse-element')

// test('render - $any on top', t => {
//   const state = s([ 1, 2 ])
//   const app = render(
//     {
//       $: '$any',
//       tag: 'ul',
//       props: {
//         default: {
//           tag: 'li',
//           text: { $: true }
//         }
//       }
//     },
//     state
//   )
//   t.equal(p(app), '<ul><li>1</li><li>2</li></ul>', 'initial')
//   t.end()
// })

// test('render - $switch on top', t => {
//   const state = s({
//     text: ':/',
//     html: ':)'
//   })
//   const app = render(
//     {
//       switcher: {
//         $: 'a.$switch',
//         $switch: state => state.origin().key,
//         props: {
//           text: { type: 'text', $: true },
//           html: { type: 'element', html: { $: true } }
//         }
//       }
//     },
//     state
//   )
//   t.equal(p(app), '<div></div>', 'initial')
//   state.set({ a: state.text })
//   t.equal(p(app), '<div>:/</div>', 'swtich')
//   state.a.set(state.html)
//   t.equal(p(app), '<div><div>:)</div></div>', 'change reference')
//   t.end()
// })

test('render - to element', t => {
  const state = s({
    a: '☄️',
    b: '🐗'
  })

  console.log(document.documentElement)

  var x = document.documentElement

  const app = render(
    x,
    {
      text: '???',
      head: {
        title: { tag: 'title', text: 'yo!' } // make some default
      },
      body: {
        tag: 'body',
        text: 'x'
      }
      // switcher: {
      //   $: 'a.$switch',
      //   $switch: state => state.origin().key,
      //   props: {
      //     text: { type: 'text', $: true },
      //     html: { type: 'element', html: { $: true } }
      //   }
      // }
    },
    state
  )

  console.log(x, app)
  console.log(app === x)
  // t.equal(p(app), '<div></div>', 'initial')
  // state.set({ a: state.text })
  // t.equal(p(app), '<div>:/</div>', 'swtich')
  // state.a.set(state.html)
  // t.equal(p(app), '<div><div>:)</div></div>', 'change reference')
  t.end()
})
