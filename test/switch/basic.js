const render = require('../../render')
const test = require('tape')
// const parse = require('parse-element')
const s = require('brisky-struct')
// const strip = require('strip-formatting')

test('switch - basic', t => {
  const state = s({ field: { navigation: {} } })
  const app = render(
    {
      holder: {
        tag: 'holder',

        text: { $: 'navigation', $transform: val => val + ' normal' },

        // x: {
          // tag: 'fragment',
        switcher: {
          $switch: (state, subs, tree, key) => {
            console.log('switch it', state, subs, key)
            if (state.compute() === 100) {
              console.log('??')
              return false
            }
            if (state.compute() === 2) {
              console.log('SWITCH', subs.props[key].any)
              return subs.props[key].any
            }
            return subs.props[key].self
            // return true
          },
          $: 'navigation.$switch',
          text: { $: true, $transform: val => val + ' switch' },
          props: {
            any: {
              $: 'root.items.$any',
              props: {
                default: { type: 'text', $: true }
              }
            }
          }
        },
        // },

        bla: {
          text: { $: 'navigation', $transform: val => val + '?' }
        }
      }
    },
    state,
    subs => {
      console.log('SUBS:', subs)
    }
  )

  state.set({
    items: [ 1, 2, 3, 4 ],
    navigation: [ '@', 'root', 'items', 0 ]
  })

  setTimeout(() => {
    state.set({ items: [ 100 ] })
  }, 500)

  setTimeout(() => {
    state.set({ items: [ 2 ] })
  }, 1000)

  if (document.body) {
    document.body.appendChild(app)
  }

  t.end()
})
