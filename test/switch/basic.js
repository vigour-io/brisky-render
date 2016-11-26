const render = require('../../render')
const test = require('tape')
const parse = require('parse-element')
const s = require('brisky-struct')
const strip = require('strip-formatting')

test('switch - basic', t => {
  const state = s({ field: { navigation: {} } })
  const app = render(
    {
      types: {
        switcher: {
          $: '$switch',
          $switch: (s, subs, tree, key) => s.compute() > 1,
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
      leBlurf: {
        type: 'spesh',
        props: {
          default: {
            text: { $transform: val => `🦄  ${val}  🦄` }
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
              return 'any'
            }
            return state.compute() !== 0
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
    state
  )

  state.set({
    items: [ 1, 2, 3, 4 ],
    navigation: [ '@', 'root', 'items', 0 ]
  })

  var cnt = 0
  const defer = val => new Promise(
    resolve => setTimeout(() => resolve(val), ++cnt * 10)
  )

  t.same(parse(app), strip(`
    <div>
      <div>SPESH
        <div>🦄  2  🦄</div>
        <div>🦄  3  🦄</div>
        <div>🦄  4  🦄</div>
      </div>
      <div>SPESH
        <div>2</div>
        <div>3</div>
        <div>4</div>
      </div>
      <div>
        <div>!!!</div>
        <div>!!!</div>
        <div>!!!</div>
        <div>!!!</div>
      </div>
      <div>SPESH
        <div>2</div>
        <div>3</div>
        <div>4</div>
      </div>
      <div>🦄 switcher! 1
        <div>1 SWITCH IT SELF</div>
        <div>
          <div style="background-color:#eeeeff;">---- UNDER <b>1</b> SWITCH ------</div>
        </div>
      </div>
    </div>`))

  state.set(defer({ items: [ 100 ] }))

  state.get([ 'items', 0 ]).once(100).then(() => {
    t.same(parse(app), strip(`
      <div>
        <div>SPESH
          <div>🦄  2  🦄</div>
          <div>🦄  3  🦄</div>
          <div>🦄  4  🦄</div>
          <div>🦄  100  🦄</div>
        </div>
        <div>SPESH
          <div>2</div>
          <div>3</div>
          <div>4</div>
          <div>100</div>
        </div>
        <div>
          <div>!!!</div>
          <div>!!!</div>
          <div>!!!</div>
          <div>!!!</div>
        </div>
        <div>SPESH
          <div>2</div>
          <div>3</div>
          <div>4</div>
          <div>100</div>
        </div>
        <div>🦄 switcher! 100<div><div style="background-color:#eeeeff;">---- UNDER <b>100</b> SWITCH ------</div></div></div>
      </div>`), 'switch 2 to 100')
  })

  state.set(defer({ items: [ 2 ] }))
  state.set(defer({ items: [ 0 ] }))
  state.set(defer({ items: state.items.map(val => 0) }))
  state.set(defer({ items: state.items.map((val, key) => key) }))
  state.set(defer({ items: [ 2 ] }))
  state.set(defer({ navigation: '🦄' }))
  state.set(defer({ navigation: 0 }))

  //  t.end()

  state.get('navigation').once((t) => t.val === 0).then(() => {
    t.same(parse(app), strip(`
      <div>
        <div>SPESH
          <div>🦄  2  🦄</div>
          <div>🦄  3  🦄</div>
          <div>🦄  2  🦄</div>
        </div>
        <div>SPESH
          <div>2</div>
          <div>3</div>
          <div>2</div>
        </div>
        <div>
          <div>!!!</div>
          <div>!!!</div>
          <div>!!!</div>
          <div>!!!</div>
        </div>
        <div>SPESH
          <div>2</div>
          <div>3</div>
          <div>2</div>
        </div>
        <div>🦄 switcher! 0<div><div style="background-color:#eeeeff;">---- UNDER <b>0</b> SWITCH ------</div></div></div>
      </div>`), 'switch navigation to 0')
    t.end()
  })

  if (document.body) {
    document.body.appendChild(app)
  }
})

/*
glob tests

'use strict'
const test = require('tape')
const subsTest = require('../util')

test('switch - glob', (t) => {
  const subscription = {
    field: {
      $switch: {
        $remove: true,
        '*.b': { val: true },
        'a.*.b': { val: true }
      }
    }
  }

  const s = subsTest(
    t,
    {
      field: '$root.a.x.b',
      a: {
        x: {
          b: 'im a/x/b'
        }
      },
      b: {
        b: 'im b/b'
      },
      z: {
        b: 'im z/b',
        z: 'im z/z'
      }
    },
    subscription
  )

  s('initial subscription', [
    { type: 'new', path: 'a/x/b', tree: 'field/$switch/$current' }
  ])

  s(
    'set field to b/b',
    [
      { path: 'a/x/b', type: 'remove', tree: 'field/$switch/$current' },
      { path: 'b/b', type: 'new' }
    ],
    { field: '$root.b.b' }
  )

  s(
    'set field to z/b',
    [
      { path: 'b/b', type: 'remove', tree: 'field/$switch/$current' },
      { path: 'z/b', type: 'new' }
    ],
    { field: '$root.z.b' }
  )

  s(
    'set field to z/z',
    [
      { path: 'z/b', type: 'remove', tree: 'field/$switch/$current' }
    ],
    { field: '$root.z.z' }
  )

  t.end()
})
*/
