'use strict'
const render = require('../../render')
const test = require('tape')
const parse = require('parse-element')
const s = require('vigour-state/s')

test('any - basic', function (t) {
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
    parse(elem),
    '<div><div><span><div>a</div></span><span><div>b</div></span></div></div>',
    'create multiple rows'
  )

  state.collection[0].remove()
  t.equal(
    parse(elem),
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
    parse(
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

test('any - merge', function (t) {
  const simple = {
    types: {
      collection: {
        tag: 'fragment',
        $: 'collection.$any',
        child: { tag: 'b', title: { tag: 'fragment', text: { $: 'title' } } }
      }
    },
    holder1: { type: 'collection' },
    holder2: { type: 'collection' }
  }
  const app = render(simple, { collection: [ { title: 1 }, { title: 2 } ] })
  t.equal(
    parse(app),
    '<div><b>1</b><b>2</b><b>1</b><b>2</b></div>',
    'intial subscription'
  )
  t.end()
})
