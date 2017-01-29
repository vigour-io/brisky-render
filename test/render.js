const { render, clearStyleCache, element } = require('../')
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

test('render - to element', t => {
  element.noResolve(false)
  clearStyleCache()
  const state = s({ loader: 1 })

  const code = {
    tag: 'html',
    head: {
      tag: 'head',
      favicon: {
        tag: 'link',
        attr: {
          rel: 'shortcut icon',
          href: {
            $: 'loader',
            $transform: val => `${val}.jpg`
          }
        }
      },
      title: { tag: 'title', text: { $: 'loader' } } // make some default
    },
    body: {
      tag: 'body',
      bla: {
        text: 'x',
        style: { border: '2px solid red' }
      }
    }
  }

  // document.body.appendChild(strange)
  if (typeof window === 'undefined') {
    const app = render(
      code,
      state
    )
    t.equal(p(app), strip(`
      <html id="5381">
         <head id="2087219016">
            <link id="2846275255" rel="shortcut icon" href="1.jpg">
            </link>
            <title id="968280941">1</title>
            <style> .a {border:2px solid red;} </style>
         </head>
         <body id="2088244976">
            <div class=" a">x</div>
         </body>
      </html>
    `))
  } else {
    const strange = document.createElement('html')

    strange.innerHTML = strip(`<head id="2087219016">
      <link id="2846275255" rel="shortcut icon" href="1.jpg">
        </link>
        <title id="968280941">1</title>
        <style> .a {border:2px solid red;} </style>
     </head>
     <div class=" a">10</div>
     <div class=" a">9</div>
     <div class=" a">8</div>
     <div class=" a">7</div>
     <div class=" a">6</div>
     <div class=" a">5</div>
     <div class=" a">4</div>
     <div class=" a">3</div>
     <div class=" a">2</div>
     <div class=" a">1</div>
     <body id="2088244976">
        <div class=" a">x</div>
     </body>`)

    document.body.appendChild(strange)

    // let j = 1e5
    // while (j--) {
    //   let div = document.createElement('div')
    //   div.id = j
    //   // div.innerHTML = 'bla'
    //   document.body.appendChild(div)
    // }

    strange.setAttribute('id', 5381)
    console.log('\n\nSTART')

    // const div = document.createElement('div')
    let i = 10000
    var d = Date.now()
    var app
    while (i--) {
      app = render(
        strange,
        code,
        state
      )
    }
    console.log(Date.now() - d, 'ms')
    t.equal(app, strange, 'enhances original')

    t.equal(app.outerHTML, strip(`
     <html>
       <head>
          <style> .a {border:2px solid red;} </style>
          <link rel="shortcut icon" href="1.jpg">
          <title>1</title>
       </head>
       <body>
          <div class=" a">x</div>
       </body>
      </html>`, 'correct resolvement')
    )
  }
  element.noResolve(true)

  t.end()
})

// test('render - overtake / resolve', t => {
//   element.noResolve(false)
//   const state = s({ text: 1 })
//   const app = {
//     body: {
//       hello: {
//         text: { $: 'text' }
//       },
//       bla: {
//         text: 'x',
//         y: {
//           hello: {
//             x: { text: 'hello' }
//           }
//         },
//         style: { border: '1px solid red' }
//       }
//     }
//   }

//   /*
//     <div>HELLO</div>
//     <div id="drollie">💩</div>
//     <div id="123456123">🦄</div>
//   */

//   const htmlResult = strip(`
//     <div id="5381">
//        <div id="2088244976">
//           <div id="404059415">1</div>
//           <div class=" a" id="5031834">
//              x
//              <div>
//                 <div>
//                    <div>hello</div>
//                 </div>
//              </div>
//           </div>
//        </div>
//        <style> .a {border:1px solid red;} </style>
//     </div>
//   `)

//   clearStyleCache()
//   var overtake
//   if (typeof window === 'undefined') {
//     overtake = render(app, state)
//     // console.log('\n------------------------------')
//     // console.log(p(overtake))
//     // console.log('------------------------------')
//     t.equal(p(overtake), htmlResult)
//   } else {
//     overtake = document.createElement('div')
//     overtake.innerHTML = htmlResult
//     overtake = overtake.childNodes[0]
//     document.body.appendChild(overtake)
//   }

//   render(overtake, app, state)
//   element.noResolve(true)
//   t.end()
// })
