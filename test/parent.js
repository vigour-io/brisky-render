'use strict'
const render = require('../render')
const test = require('tape')
const p = require('parse-element')
const s = require('vigour-state/s')
const strip = require('vigour-util/strip/formatting')

test('parent', (t) => {
  const state = s({ first: true })
  const app = render({
    first: {
      tag: 'h1',
      $: 'first'
    }
  }, state)
  t.equal(p(app), '<div><h1></h1></div>', 'correct initial html')
  state.first.remove()
  t.equal(p(app), '<div></div>', 'removed node')
  t.end()
})

test('parent - error', (t) => {
  var tree
  const state = s({})
  render({
    first: {
      tag: 'h1',
      text: { $: 'first' }
    }
  }, state, (s, t) => {
    tree = t
  })

  delete tree._[210]
  try {
    state.set({ first: 'hello' })
  } catch (e) {
    t.equal(
      strip(e.message),
      strip('No parent in treetype: "new" pid: "210"path: "first"'),
      'correct error message'
    )
    t.end()
  }
})
