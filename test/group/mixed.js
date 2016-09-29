'use strict'
const render = require('../../render')
const test = require('tape')
const s = require('vigour-state/s')
const getParent = require('../../lib/render/dom/parent')
const p = require('parse-element')

test('group - mixed', function (t) {
  const state = s({
    something: { letters: { a: 'blue' } }
  })
  var sub
  const app = render({
    letters: {
      border: {
        // $: 'something', -- default will be 1

        // first for jsut travel then rest
        type: 'group',
        render: {
          state (target, s, type, stamp, subs, tree, id, pid, store) {
            const node = getParent(type, stamp, subs, tree, pid)
            node.style.border = `${store.b} solid ${store.a}`
          }
        },
        a: {
          $: 'letters.a.$test',
          $test: state => true
        },
        b: '10px'
      }
    }
  }, state, (s) => {
    sub = s
  })
  console.log(sub.something)
  t.equal(p(app), '<div><div ab="A B"></div></div>', 'initial')
  // state.something.letters.a.set('pink')
  // t.equal(p(app), '<div><div ab="x B"></div></div>', 'update')
  // state.something.letters.a.remove()
  // t.equal(p(app), '<div><div ab="- B"></div></div>', 'remove')

  document.body.appendChild(app)

  t.end()
})

/*
 so what to do group will need to add itself to multiple _s fields
*/
