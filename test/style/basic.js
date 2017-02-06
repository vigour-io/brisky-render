const test = require('tape')
const { create: s } = require('brisky-struct')
const p = require('parse-element')
const { render, clearStyleCache } = require('../../')

test('basic - static styles', t => {
  clearStyleCache()
  var elem = render({
    style: {
      padding: '10px',
      backgroundColor: 'blue',
      opacity: 0.5
    }
  })
  t.equal(elem.className, ' a b c')
  // t.equal(elem.style.padding, '100px', 'add style property')
  // t.equal(Number(elem.style.opacity), 0.5, 'add style property opacity')
  clearStyleCache()
  elem = render({
    style: {
      padding: '10px',
      backgroundColor: 'blue',
      margin: '50px'
    }
  })
  t.equal(elem.className, ' a b c')

  console.log(p(elem))

  if (document.body) document.body.appendChild(elem)
  t.end()
})

// test('basic - static styles', t => {
//   clearStyleCache()
//   var elem = render({
//     style: {
//       padding: '100px',
//       opacity: 0.5
//     }
//   })
//   t.equal(elem.className, ' a b')

//   clearStyleCache()
//   elem = render({
//     style: {
//       padding: '100px',
//       margin: '50px'
//     }
//   })
//   t.equal(elem.className, ' a b')
//   t.end()
// })

// test('basic - state styles', t => {
//   var elem = render({
//     style: {
//       display: {
//         $: 'thing'
//       }
//     }
//   }, {
//     thing: 'none'
//   })

//   t.equals(elem.style.display, 'none', 'add display property using state')

//   const state = s({
//     thing: 'none'
//   })

//   elem = render({
//     $: 'thing',
//     style: {
//       display: {
//         $: true
//       }
//     }
//   }, state)

//   t.equals(elem.style.display, 'none', 'add display property using state true')

//   state.set({
//     thing: 'block'
//   })

//   t.equals(elem.style.display, 'block', 'add display property using state true, update')

//   t.end()
// })

// test('basic - state - px', t => {
//   const state = s({
//     width: '100px'
//   })
//   const app = render({
//     style: {
//       width: {
//         $: 'width'
//       }
//     }
//   }, state)
//   t.equals(p(app), '<div style="width: 100px;"></div>', 'correct initial width')
//   state.width.set('200px')
//   t.equals(p(app), '<div style="width: 200px;"></div>', 'correct initial width')
//   t.end()
// })

// test('basic - context styles', t => {
//   var elem = render({
//     types: {
//       thing: {
//         $: 'thing',
//         foo: {
//           style: {
//             display: {
//               $: true,
//               $transform (val) {
//                 return val
//               }
//             }
//           }
//         }
//       }
//     },
//     a: {
//       type: 'thing'
//     },
//     b: {
//       type: 'thing'
//     }
//   }, {
//     thing: 'none'
//   })

//   t.equals(elem.childNodes[0].childNodes[0].style.display, 'none', 'add display property using state')
//   t.end()
// })

// test('basic - state + static styles create', t => {
//   clearStyleCache()
//   const state = s()
//   const elem = render({
//     fields: {
//       $: 'list.$any',
//       props: {
//         default: {
//           style: {
//             padding: '100px',
//             opacity: 0.5,
//             border: '1px solid rgb(0,0,0)'
//           }
//         }
//       }
//     }
//   }, state)

//   state.set({
//     list: {
//       bla: true
//     }
//   })

//   t.equal(p(elem), `<div><div><div class=" a b c"></div></div><style> .a {padding:100px;} .b {opacity:0.5;} .c {border:1px solid rgb(0,0,0);} </style></div>`)

//   t.end()
// })

// test('basic - state + static styles update', t => {
//   clearStyleCache()
//   const state = s()
//   const elem = render({
//     style: { backgroundColor: 'rgb(22,22,22)' },
//     fields: {
//       $: 'list.$any',
//       props: {
//         default: {
//           style: {
//             padding: '100px',
//             opacity: 0.5,
//             border: '1px solid rgb(0,0,0)'
//           }
//         }
//       }
//     }
//   }, state)

//   state.set({
//     list: {
//       bla: true
//     }
//   })

//   t.equal(p(elem), `<div class=" a"><style> .a {background-color:rgb(22,22,22);} .b {padding:100px;} .c {opacity:0.5;} .d {border:1px solid rgb(0,0,0);} </style><div><div class=" b c d"></div></div></div>`)

//   t.end()
// })
