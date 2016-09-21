'use strict'
const render = require('../../render')
const test = require('tape')
const parse = require('parse-element')
const strip = require('vigour-util/strip/formatting')
const s = require('vigour-state/s')

// test('any - switch - basic', function (t) {
//   const state = s({
//     holder: {
//       items: [ 1, 2 ]
//     }
//   })

//   const app = render({
//     $: 'holder',
//     page: {
//       $: 'items.$any',
//       child: {
//         $: '$switch',
//         $switch: val => 'sameAsAlways',
//         properties: {
//           sameAsAlways: {
//             text: { $: true }
//           }
//         }
//       }
//     }
//   }, state)

//   t.same(
//     parse(app),
//     strip(`
//       <div>
//         <div>
//           <div>
//             <div>1</div>
//           </div>
//           <div>
//             <div>2</div>
//           </div>
//         </div>
//       </div>
//     `)
//   )
//   document.body.appendChild(app)

//   t.end()
// })

test('any - switch - type', function (t) {
  const state = s({
    holder: {
      items: [ 1, 2 ]
    }
  })

  const app = render({
    $: 'holder',
    types: {
      page: {
        $: 'items.$any',
        child: {
          $: '$switch',
          $switch: val => 'sameAsAlways',
          properties: {
            sameAsAlways: {
              text: { $: true }
            }
          }
        }
      }
    },
    page: {
      text: 'xxx',
      type: 'page'
    }
  }, state)

  document.body.appendChild(app)

  t.same(
    parse(app),
    strip(`
      <div>
        <div>
          <div>
            <div>1</div>
          </div>
          <div>
            <div>2</div>
          </div>
        </div>
      </div>
    `)
  )

  t.end()
})
