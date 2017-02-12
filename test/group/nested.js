const { render, parent } = require('../../')
const test = require('tape')
const { create: s } = require('brisky-struct')
const p = require('parse-element')

test('group - nested', t => {
  const state = s({
    letters: {
      a: 'a',
      b: 'b'
    }
  })
  const app = render({
    letters: {
      $: 'letters',
      ab: {
        type: 'group',
        subscriptionType: true,
        render: {
          state (target, s, type, subs, tree, id, pid, store) {
            const node = parent(tree, pid)
            node.setAttribute('ab', `${store.a || '-'} ${store.nested.b || '-'}`)
          }
        },
        a: { $: 'a' },
        nested: {
          b: { $: 'b' }
        }
      }
    }
  }, state)

  t.equal(p(app), '<div><div ab="a b"></div></div>', 'initial subscription')
  t.end()
})
