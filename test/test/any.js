const { render } = require('../../')
const test = require('tape')
const parse = require('parse-element')
const { create: s } = require('brisky-struct')
const strip = require('strip-formatting')

test('$switch (test) - $any', t => {
  const state = s({
    fields: {
      items: [ 1, 2 ]
    },
    title: 'hello',
    nav: [ '@', 'parent', 'fields' ]
  })

  var app = render({
    switcher: {
      $: 'nav.$switch',
      tag: 'fragment',
      props: {
        fields: {
          $: 'items.$any',
          props: { default: { text: '(｀^´)' } }
        },
        title: { text: 'ಠ_ರೃ' }
      }
    }
  }, state)

  t.same(
    parse(app),
    strip(`
      <div>
        <div>
          <div>(｀^´)</div>
          <div>(｀^´)</div>
        </div>
      </div>
    `),
    'set switcher'
  )

  // state.nav.set([ '@', 'parent', 'title' ])

  // t.same(
  //   parse(app),
  //   strip(`
  //     <div>
  //       <div>
  //         ಠ_ರೃ
  //       </div>
  //     </div>
  //   `),
  //   'set switcher'
  // )

  t.end()
})

// test('$switch (test) - any - reference change', t => {
//   const state = s({
//     holder: {
//       fields: {
//         items: [ 1, 2 ]
//       },
//       fields2: {
//         items: [ 3, 4 ]
//       },
//       current: [ '@', 'root', 'holder', 'fields' ]
//     }
//   })
//   var app = render({
//     $: 'holder.current',
//     page: {
//       $: 'items.$any',
//       props: {
//         default: {
//           $switch: state => {
//             return state.origin().val !== void 0
//           },
//           $: '$switch',
//           text: { $: true }
//         }
//       }
//     }
//   }, state)

//   t.same(
//     parse(app),
//     strip(`
//       <div>
//         <div>
//           <div>1</div>
//           <div>2</div>
//         </div>
//       </div>
//     `)
//   )

//   state.holder.current.set(state.holder.fields2)
//   t.same(
//     parse(app),
//     strip(`
//       <div>
//         <div>
//           <div>3</div>
//           <div>4</div>
//         </div>
//       </div>
//     `)
//   )

//   if (document && document.body) {
//     document.body.appendChild(app)
//   }

//   t.end()
// })
