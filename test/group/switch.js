'use strict'
const render = require('../../render')
const test = require('tape')
const s = require('vigour-state/s')
const getParent = require('../../lib/render/dom/parent')
const p = require('parse-element')

test('group - switch', function (t) {
  const state = s({
    letters: {},
    something: '$root.letters'
  })

  const app = render({
    field: {
      tag: 'fragment',
      $: 'something.$switch',
      $switch: (state) => state.key,
      properties: {
        nothing: {
          text: { $: true }
        },
        letters: {
          ab: {
            type: 'group',
            render: {
              state (target, state, type, stamp, subs, tree, id, pid, store) {
                const node = getParent(type, stamp, subs, tree, pid)
                node.setAttribute('ab', `${store.a || '-'} ${store.b || '-'}`)
              }
            },
            a: { $: 'a' }
          }
        }
      }
    }
  }, state, (s) => { global.s = s })

  t.equal(p(app), '<div><div ab="- -"></div></div>', 'initial subscription')

  // console.log(global.s)
  console.log(global.s.something['$switch1cs897c'].letters)
  // console.log(global.s.something['$switch-field'].letters.val =)

  state.letters.set({ a: 'A' })
  t.equal(p(app), '<div><div ab="A -"></div></div>', 'update something.a')

  t.end()
})
