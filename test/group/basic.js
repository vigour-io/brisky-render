import { render, parent } from '../../'
import test from 'tape'
import { create as s } from 'brisky-struct'
import p from 'parse-element'

test('group - remove', t => {
  const state = s({
    letters: { a: 'a', b: 'b' }
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
            node.setAttribute('ab', `${store.a || '-'} ${store.b || '-'}`)
          }
        },
        a: { $: 'a' },
        b: { $: 'b' }
      }
    }
  }, state)

  t.equal(p(app), '<div><div ab="a b"></div></div>', 'initial subscription')
  t.end()
})
