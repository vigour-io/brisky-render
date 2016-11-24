'use strict'
const render = require('../../render')
const test = require('tape')
const s = require('brisky-struct')
const getParent = require('../../lib/render/dom/parent')
const p = require('parse-element')

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
          state (target, s, type, stamp, subs, tree, id, pid, store) {
            const node = getParent(type, stamp, subs, tree, pid)
            node.setAttribute('ab', `${store.a || '-'} ${store.b || '-'}`)
          }
        },
        a: { $: 'a.$test', $test: val => val.compute() === 'a' },
        b: { $: 'b' }
      }
    }
  }, state, (s) => { global.s = s })

  t.equal(p(app), '<div><div ab="a b"></div></div>', 'initial subscription')
  state.letters.set({ a: 'no' })
  t.equal(p(app), '<div><div ab="- b"></div></div>', 'update "a" to no')
  t.end()
})
