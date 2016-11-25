const render = require('../../render')
const test = require('tape')
// const parse = require('parse-element')
const s = require('brisky-struct')
// const strip = require('strip-formatting')

test('switch - basic', t => {
  const state = s({ field: { navigation: {} } })
  const app = render(
    {
      types: {
        switcher: {
          tag: 'switch',
          // $: '$switch',
          // // if you type switch autoamticly add $: '$switch' as a sub if it does not have $
          // $switch: (s, subs, tree, key) => {
          //   if (s.compute() > 1) {
          //     return subs.props[key].self
          //   }
          // },
          text: { $: true }
        },
        spesh: {
          tag: 'spesh',
          $: 'root.items.$any',
          props: {
            default: { type: 'switcher' }
          }
        }
      },
      bla: { type: 'spesh' }
      // x: {
      //   $: 'root.items.$any',
      //   props: {
      //     default: { type: 'switcher' }
      //   }
      // }
      // holder: {
      //   tag: 'holder',
      //   // text: { $: 'navigation', $transform: val => val + ' normal' },
      //   switcher: {
      //     $switch: (state, subs, tree, key) => {
      //       if (state.compute() === 100) {
      //         return false
      //       } else if (state.compute() === 2) {
      //         return subs.props[key].any
      //       } else if (state.compute() !== 0) {
      //         return subs.props[key].self
      //       }
      //     },
      //     $: 'navigation.$switch',
      //     text: { $: true, $transform: val => val + ' switch' },
      //     props: {
      //       any: {
      //         type: 'spesh'
      //       }
      //     }
      //   }
        // bla: {
        //   text: { $: 'navigation', $transform: val => val + '?' }
        // }
      // }
    },
    state,
    subs => {
      console.log('SUBS:', subs)
    }
  )

  state.set({
    items: [ 1, 2, 3, 4 ],
    // items: [ 1, 2, 3, 4 ],
    navigation: [ '@', 'root', 'items', 0 ]
  })

  // setTimeout(() => {
  //   state.set({ items: [ 100 ] })
  // }, 500)

  // setTimeout(() => {
  //   state.set({ items: [ 2 ] })
  // }, 0)

  // setTimeout(() => {
  //   state.set({ navigation: 0 })
  // }, 2000)

  if (document.body) {
    document.body.appendChild(app)
  }

  t.end()
})
