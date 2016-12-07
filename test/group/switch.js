const render = require('../../render')
const test = require('tape')
const s = require('brisky-struct')
const getParent = require('../../lib/render/dom/parent')
const p = require('parse-element')

test('group - switch', t => {
  const state = s({
    letters: {},
    something: [ '@', 'root', 'letters' ]
  })

  const app = render({
    field: {
      tag: 'fragment',
      $: 'something.$switch',
      $switch: state => state.origin().key,
      props: {
        nothing: {
          text: { $: true }
        },
        letters: {
          ab: {
            type: 'group',
            subscriptionType: true,
            $: true,
            render: {
              state (target, s, type, subs, tree, id, pid, store) {
                const node = getParent(tree, pid)
                node.setAttribute('ab', `${store.a || '-'} ${store.b || '-'}`)
              }
            },
            a: { $: 'a' }
          }
        }
      }
    }
  }, state)

  t.equal(p(app), '<div><div ab="- -"></div></div>', 'initial subscription')
  state.letters.set({ a: 'A' })
  t.equal(p(app), '<div><div ab="A -"></div></div>', 'update something.a')

  t.end()
})
