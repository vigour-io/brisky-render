import { render } from '../../'
import test from 'tape'
import parse from 'parse-element'
import { create as s } from 'brisky-struct'
// import strip from 'strip-formatting'

test('switch - basic', t => {
  const state = s({
    field: [ '@', 'root', 'a', 'x', 'b' ],
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
  })
  const app = render(
    {
      // switch on top level is currently not supported
      holder: {
        $: 'field.$switch',
        props: {
          '*.b': { tag: 'fragment', text: { $: true } },
          'a.*.b': { tag: 'fragment', text: { $: true, $transform: val => val + '🦄' } }
        }
      }
    },
    state
  )

  t.same(parse(app), '<div>im a/x/b🦄</div>')
  state.field.set(state.b.b)
  t.same(parse(app), '<div>im b/b</div>')
  state.field.set(state.z.b)
  // this only fired an update so no switch... since its the same need to think of something for that...
  // eg. force new when the $t changes or something
  t.same(parse(app), '<div>im z/b</div>')
  state.field.set(state.z.z)
  t.same(parse(app), '<div></div>')

  if (document.body) {
    document.body.appendChild(app)
  }

  t.end()
})

//   s(
//     'set field to z/b',
//     [
//       { path: 'b/b', type: 'remove', tree: 'field/$switch/$current' },
//       { path: 'z/b', type: 'new' }
//     ],
//     { field: '$root.z.b' }
//   )

//   s(
//     'set field to z/z',
//     [
//       { path: 'z/b', type: 'remove', tree: 'field/$switch/$current' }
//     ],
//     { field: '$root.z.z' }
//   )

//   t.end()
// })
// */
