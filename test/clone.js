'use strict'
const render = require('../render')
const test = require('tape')
const s = require('brisky-struct')
const browser = require('./browser')
const getParent = require('../lib/render/dom/parent')

test('clone - reuse ', function (t) {
  const state = global.state = s({
    one: {
      a: 'one',
      b: 'http://cdn.images.express.co.uk/img/dynamic/1/590x/secondary/Cat-536495.jpg'
    },
    two: {
      a: 'two'
    }
  })

  const app = browser(render({
    types: {
      img: {
        title: { text: { $: 'a' } },
        img: {
          tag: 'img',
          class: {
            type: 'property',
            render: {
              static (target, node) {
                node.className = target.parent.parent.key
              }
            }
          },
          src: {
            type: 'property',
            $: 'b',
            render: {
              state (target, s, type, stamp, subs, tree, id, pid, store) {
                const node = getParent(type, stamp, subs, tree, pid)
                node.src = s.compute()
              }
            }
          }
        }
      }
    },
    one: {
      type: 'img',
      $: 'two'
    },
    two: {
      type: 'img',
      $: 'one'
    }
  }, state))
  var src = app.childNodes[0].childNodes[1].getAttribute('src')
  if (src && src.value) { src = src.value }
  if (!src) { src = void 0 }
  t.equal(src, void 0, 'child .one does not inherit src')
  t.end()
})
