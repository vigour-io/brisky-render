const { render } = require('../')
const test = require('tape')
const { create: s } = require('brisky-struct')
const browser = require('./browser')
const { parent } = require('../')

test('clone - reuse ', t => {
  const state = global.state = s({
    one: {
      a: 'one',
      b: 'http://cdn.images.express.co.uk/img/dynamic/1/590x/secondary/Cat-536495.jpg'
    },
    two: {
      a: 'two'
    },
    three: { a: 'three' }
  })

  const staticKitten = 'https://files.graphiq.com/stories/t2/tiny_cat_12573_8950.jpg'

  const app = browser(render({
    types: {
      img: {
        title: { text: { $: 'a' } },
        img: {
          tag: 'img',
          class: {
            type: 'property',
            render: {
              static (target, node) { node.className = target.parent().key }
            }
          },
          src: {
            type: 'property',
            $: 'b',
            render: {
              static: (t, node) => {
                node.setAttribute('src', t.compute())
              },
              state (t, s, type, subs, tree, id, pid, store) {
                const node = parent(tree, pid)
                node.setAttribute('src', t.compute(s))
              }
            }
          }
        }
      }
    },
    one: {
      type: 'img',
      $: 'two',
      img: {
        src: { $: null, val: staticKitten }
      }
    },
    two: {
      type: 'img',
      $: 'three'
    },
    three: {
      type: 'img',
      $: 'one'
    }
  }, state))

  var src = app.childNodes[1].childNodes[1].getAttribute('src')
  if (src && src.value) { src = src.value }
  if (!src) { src = void 0 }
  t.equal(src, void 0, 'child .three does not inherit src')
  src = app.childNodes[0].childNodes[1].getAttribute('src')
  if (src && src.value) { src = src.value }
  t.equal(src, staticKitten, 'child .one has a staticKitten')
  t.end()
})
