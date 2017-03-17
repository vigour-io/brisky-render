const { render
  // , clearStyleCache
  , element
} = require('../')
const test = require('tape')
const { create: s } = require('brisky-struct')
const p = require('parse-element')
const strip = require('strip-formatting')
// stirp formatting will remove data-hash

test('render - $any on top', t => {
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

test('render - $switch on top', t => {
  const state = s({
    text: ':/',
    html: ':)'
  })
  const app = render(
    {
      switcher: {
        $: 'a.$switch',
        $switch: state => state.origin().key,
        props: {
          text: { type: 'text', $: true },
          html: { type: 'element', html: { $: true } }
        }
      }
    },
    state
  )
  t.equal(p(app), '<div></div>', 'initial')
  state.set({ a: state.text })
  t.equal(p(app), '<div>:/</div>', 'swtich')
  state.a.set(state.html)
  t.equal(p(app), '<div><div>:)</div></div>', 'change reference')
  t.end()
})

// test('render - to element', t => {
//   element.noResolve(false)
//   clearStyleCache()
//   const state = s({
//     loader: 1,
//     list: [ 1, 2, 3, 4, 5 ]
//   })

//   const code = {
//     field: {
//       fields: {
//         $: 'list.$any',
//         props: {
//           default: {
//             style: {
//               position: 'relative',
//               display: 'flex',
//               alignItems: 'center',
//               height: '30px',
//               // transition: 'all 0.2s ease-in-out',
//               paddingLeft: '15px'
//             },
//             on: {
//               click () {

//               }
//             },
//             text: { $: true }
//           }
//         }
//       },
//       title: { text: { $: 'loader' } } // make some default
//     }
//   }

//   // document.body.appendChild(strange)
//   if (typeof window === 'undefined') {
//     const app = render(
//       code,
//       state
//     )
//     console.log('\n---------------------------')
//     console.log(p(app))
//     console.log('---------------------------')
//     // t.equal(p(app), strip(`
//     //   <html id="5381">
//     //      <head id="2087219016">
//     //         <link id="2846275255" rel="shortcut icon" href="1.jpg">
//     //         </link>
//     //         <title id="968280941">1</title>
//     //         <style> .a {border:2px solid red;} </style>
//     //      </head>
//     //      <body id="2088244976">
//     //         <div class=" a">x</div>
//     //      </body>
//     //   </html>
//     // `))
//   } else {
//     // document.body.appendChild(strange)

//     // let j = 1e5
//     // while (j--) {
//     //   let div = document.createElement('div')
//     //   div.id = j
//     //   // div.innerHTML = 'bla'
//     //   document.body.appendChild(div)
//     // }

//     console.log('\n\nSTART')

//     let strange = document.createElement('div')
//     strange.innerHTML = strip(`<div id="172192"><div id="1134951623"><div id="3671287540"><div id="2847808079" style="position: relative; display: flex; align-items: center; height: 30px; padding-left: 15px;">1</div><div id="2847808046" style="position: relative; display: flex; align-items: center; height: 30px; padding-left: 15px;">2</div><div id="2847808013" style="position: relative; display: flex; align-items: center; height: 30px; padding-left: 15px;">3</div><div id="2847808236" style="position: relative; display: flex; align-items: center; height: 30px; padding-left: 15px;">4</div><div id="2847808203" style="position: relative; display: flex; align-items: center; height: 30px; padding-left: 15px;">5</div></div><div id="3457402754">1</div></div></div>`)
//     // strange.setAttribute('id', 172192)

//     // const div = document.createElement('div')
//     let i = 1
//     var d = Date.now()
//     var app
//     // while (i--) {
//     let div = strange.childNodes[0].cloneNode(true)
//     app = render(
//         div,
//         code,
//         state
//       )
//     document.body.appendChild(div)
//     // }
//     console.log(Date.now() - d, 'ms')
//     // t.equal(app, strange, 'enhances original')

//     // t.equal(app.outerHTML, strip(`
//     //   <html>
//     //     <head>
//     //       <link rel="shortcut icon" href="1.jpg">
//     //       <title>1</title>
//     //       <style> .a {border:2px solid red;} </style>
//     //     </head>
//     //   </html>`))
//   }
//   element.noResolve(true)

//   t.end()
// })

test('render - overtake / resolve', t => {
  element.noResolve(false)
  const state = s({ text: 1 })
  const app = {
    text: 'hello',
    bla: {
      text: 'x'
    }
  }

  const htmlResult = strip(`
    <div id="172192">hello<div>x</div></div>
  `)

  var overtake
  if (typeof window === 'undefined') {
    overtake = render(app, state)
    t.equal(p(overtake), htmlResult)
  } else {
    // overtake = document.createElement('div')
    // overtake.innerHTML = htmlResult
    // overtake = overtake.childNodes[0]
    // document.body.appendChild(overtake)
  }

  // const x = render(overtake, app, state)

  element.noResolve(true)

  t.end()
})
