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
    b: '🐗',
    loader: 1
  })

  var dir = 1
  setInterval(() => {
    state.loader.set(state.loader.compute() + dir)
  }, 18)

  console.log(document.documentElement)

  var x = document.documentElement

  // make an iframe

  /*
    <!-- Suppress browser request for favicon.ico -->
    <link rel="shortcut icon"type="image/x-icon" href="data:image/x-icon;,">
  */

  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 32
  const context = canvas.getContext('2d')
  context.fillStyle = 'green'


  const app = render(
    document.documentElement,
    {
      head: {

        favicon: {
          tag: 'link',
          attr: {
            rel: 'shortcut icon',
            href: {
              $: 'loader',
              $transform: val => {
                context.clearRect(0, 0, 32, 32)
                let i = 52
                while (i--) {
                  context.fillStyle = `rgb(${7.5 * i / 3},${7.5 * i},${7.5 * i})`
                  context.fillRect(
                    Math.sin(val / 100 + i / 7) * 15 + 15,
                    Math.cos(val / 100 + i / 7) * 15 + 15, 2, 2
                  )
                }
                // let i = 32
                // while (i--) {
                //   let j = 32
                //   while (j--) {
                //     if (val < 200) {
                //       context.fillStyle = `rgb(${val + i},${val + j},${val + (i + j)})`
                //       context.fillRect(i, j, 1, 1)
                //     }
                //   }
                // }
                return canvas.toDataURL('image/png')
              }
            }
          }
        },
        title: { tag: 'title', text: { $: 'loader' } } // make some default
      },
      body: {
        tag: 'body',
        text: 'x'
      }
    },
    state
  )
  document.body.appendChild(canvas)

  console.log(x, app)
  console.log(app === x)
  // t.equal(p(app), '<div></div>', 'initial')
  // state.set({ a: state.text })
  // t.equal(p(app), '<div>:/</div>', 'swtich')
  // state.a.set(state.html)
  // t.equal(p(app), '<div><div>:)</div></div>', 'change reference')
  t.end()
})
