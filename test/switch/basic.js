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
          $: '$switch',
          $switch: (s, subs, tree, key) => {
            if (s.compute() > 1) {
              return subs.props[key].self
            }
          },
          text: { $: true }
        },
        spesh: {
          text: 'SPESH',
          $: 'root.items.$any',
          props: {
            default: { type: 'switcher' }
          }
        }
      },
      blax: { type: 'spesh' },
      blurf: { $: 'root.items.$any', props: { default: { type: 'element', text: '!!!' } } },
      bla: { type: 'spesh' },
      holder: {
        text: { $: 'navigation', $transform: val => '🦄 switcher! ' + val },
        switcher: {
          $switch: (state, subs, tree, key) => {
            if (state.compute() === 100) {
              return false
            } else if (state.compute() === 2) {
              return subs.props[key].any
            } else if (state.compute() !== 0) {
              return subs.props[key].self
            }
          },
          $: 'navigation.$switch',
          text: { $: true, $transform: val => val + ' SWITCH IT SELF' },
          props: {
            any: { type: 'spesh' }
          }
        },
        bla: {
          html: {
            $: 'navigation',
            $transform: val =>
            `<div style="background-color:#eeeeff;">---- UNDER <b>${val}</b> SWITCH ------</div>`
          }
        }
      }
    },
    state,
    (subs, tree) => {
      // console.log('SUBS:', subs, 'TREE:', tree)
    }
  )

  state.set({
    items: [ 1, 2, 3, 4 ],
    navigation: [ '@', 'root', 'items', 0 ]
  })

  var cnt = 0
  const defer = val => new Promise(
    resolve => setTimeout(() => resolve(val), ++cnt * 500)
  )

  state.set(defer({ items: [ 100 ] }))
  state.set(defer({ items: [ 2 ] }))
  state.set(defer({ items: [ 0 ] }))
  state.set(defer({ items: state.items.map(val => 0) }))
  state.set(defer({ items: state.items.map((val, key) => key) }))
  state.set(defer({ items: [ 2 ] }))
  state.set(defer({ navigation: '🦄' }))
  state.set(defer({ navigation: 0 }))

  if (document.body) {
    document.body.appendChild(app)
  }

  t.end()
})
