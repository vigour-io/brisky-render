'use strict'
const render = require('../../render')
const test = require('tape')
const parseElement = require('parse-element')
const s = require('vigour-state/s')

test('collection - basic', function (t) {
  const app = {
    holder: {
      $: 'collection.$any',
      child: {
        tag: 'span',
        title: { text: { $: 'title' } }
      }
    }
  }

  const state = s({
    collection: [
      { title: 'a' },
      { title: 'b' }
    ]
  })

  const elem = render(app, state)

  t.equal(
    parseElement(elem),
    '<div><div><span><div>a</div></span><span><div>b</div></span></div></div>',
    'create multiple rows'
  )

  state.collection[0].remove()
  t.equal(
    parseElement(elem),
    '<div><div><span><div>b</div></span></div></div>',
    'remove first row'
  )

  try {
    render({ holder: { $: 'collection.$any' } }, state)
  } catch (e) {
    t.ok(e.message.indexOf('$any: child === Element. Define a child Element') !== -1,
      'throws error when no child is defined'
    )
  }

  t.equal(
    parseElement(
      render({
        types: {
          span: {
            tag: 'span',
            title: { text: { $: 'title' } }
          },
          collection: {
            $: 'collection.$any',
            child: { type: 'span' }
          }
        },
        holder: { type: 'collection' }
      }, state)
    ),
    '<div><div><span><div>b</div></span></div></div>',
    'context render'
  )
  t.end()
})
