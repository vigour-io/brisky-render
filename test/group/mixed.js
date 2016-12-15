const { render } = require('../../')
const test = require('tape')
const { create: s } = require('brisky-struct')
const { parent } = require('../../')
const p = require('parse-element')

test('group - mixed', t => {
  const state = s({
    something: { letters: { a: 'A' } }
  })
  const app = render({
    letters: {
      ab: {
        $: 'something',
        type: 'group',
        render: {
          state (target, s, type, subs, tree, id, pid, store) {
            const node = parent(tree, pid)
            node.setAttribute('ab', `${store.a || '-'} ${store.b || '-'}`)
          }
        },
        a: {
          $: 'letters.a.$switch',
          $switch: state => true
        },
        b: 'B'
      }
    }
  }, state)
  t.equal(p(app), '<div><div ab="A B"></div></div>', 'initial')
  state.something.letters.a.set('x')
  t.equal(p(app), '<div><div ab="x B"></div></div>', 'update')
  state.something.letters.a.set(null)
  t.equal(p(app), '<div><div ab="- B"></div></div>', 'remove')
  t.end()
})
