'use strict'
const render = require('../../render')
const test = require('tape')
const s = require('vigour-state/s')
const getParent = require('../../lib/render/dom/parent')
const p = require('parse-element')

test('group - mixed', function (t) {
  const state = s({
    something: { letters: { a: 'A' } }
  })
  const app = render({
    letters: {
      ab: {
        $: 'something',
        type: 'group',
        render: {
          state (target, state, type, stamp, subs, tree, id, pid, store) {
            const node = getParent(type, stamp, subs, tree, pid)
            node.setAttribute('ab', `${store.a || '-'} ${store.b || '-'}`)
          }
        },
        a: {
          $: 'letters.a.$test',
          $test: (state) => true
        },
        b: 'B'
      }
    }
  }, state)
  t.equal(p(app), '<div><div ab="A B"></div></div>', 'initial')
  state.something.letters.a.set('x')
  t.equal(p(app), '<div><div ab="x B"></div></div>', 'update')
  state.something.letters.a.remove()
  t.equal(p(app), '<div><div ab="- B"></div></div>', 'remove')
  t.end()
})
