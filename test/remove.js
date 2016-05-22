'use strict'
const render = require('../render')
const test = require('tape')
const p = require('parse-element')
const s = require('vigour-state/s')

test('remove', (t) => {
  const state = s({ first: true })
  // add broken operator case and everything
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

test('remove - path subscription', (t) => {
  const state = s({ first: { second: 'a' } })
  const app = render({
    first: {
      second: {
        tag: 'h1',
        $: 'first.second'
      }
    }
  }, state)
  t.equal(p(app), '<div><div><h1></h1></div></div>', 'correct initial html')
  state.first.remove()
  t.equal(p(app), '<div><div></div></div>', 'removed node')
  t.end()
})

test('remove - path subscription - $root', (t) => {
  const state = s({ first: { second: 'a' } })
  const app = render({
    first: {
      second: {
        tag: 'h1',
        $: '$root.first.second'
      }
    }
  }, state)
  t.equal(p(app), '<div><div><h1></h1></div></div>', 'correct initial html')
  state.first.remove()
  t.equal(p(app), '<div><div></div></div>', 'removed node')
  t.end()
})

test('remove - mixed and context', (t) => {
  const state = s({ first: { second: 'a' } })
  const app = render({
    components: {
      basic: {
        tag: 'p',
        first: {
          $: 'first',
          text: { $: 'second' }
        },
        second: { text: 'b' }
      }
    },
    text: { $: 'first.second' },
    basic: { type: 'basic' }
  }, state)

  t.equal(
    p(app),
    '<div>a<p><div>a</div><div>b</div></p></div>',
    'correct initial html'
  )
  state.first.remove()
  t.equal(
    p(app),
    '<div><p><div>b</div></p></div>',
    'removed node'
  )
  t.end()
})

test('remove - mixed and context - $root', (t) => {
  const state = s({ first: { second: 'a' } })
  const app = render({
    components: {
      basic: {
        tag: 'p',
        first: {
          $: '$root.first',
          text: { $: 'second' }
        },
        second: { text: 'b' }
      }
    },
    text: { $: '$root.first.second' },
    basic: { type: 'basic' }
  }, state)

  t.equal(
    p(app),
    '<div>a<p><div>a</div><div>b</div></p></div>',
    'correct initial html'
  )
  state.first.remove()
  t.equal(
    p(app),
    '<div><p><div>b</div></p></div>',
    'removed node'
  )
  t.end()
})
