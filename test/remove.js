import { render } from '../'
import test from 'tape'
import p from 'parse-element'
import { create as s } from 'brisky-struct'

test('remove', t => {
  const state = s({ first: true })
  // add broken operator case and everything
  const app = render({
    first: {
      tag: 'h1',
      $: 'first'
    }
  }, state)
  t.equal(p(app), '<div><h1></h1></div>', 'correct initial html')
  state.first.set(null)
  t.equal(p(app), '<div></div>', 'removed node')
  t.end()
})

test('remove - path subscription', t => {
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
  state.first.set(null)
  t.equal(p(app), '<div><div></div></div>', 'removed node')
  t.end()
})

test('remove - path subscription - root', t => {
  const state = s({ first: { second: 'a' } })
  const app = render({
    first: {
      second: {
        tag: 'h1',
        $: 'root.first.second'
      }
    }
  }, state)
  t.equal(p(app), '<div><div><h1></h1></div></div>', 'correct initial html')
  state.first.set(null)
  t.equal(p(app), '<div><div></div></div>', 'removed node')
  t.end()
})

test('remove - mixed and context', t => {
  const state = s({ first: { second: 'a' } })
  const app = render({
    types: {
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
  state.first.set(null)
  t.equal(
    p(app),
    '<div><p><div>b</div></p></div>',
    'removed node'
  )
  t.end()
})

test('remove - mixed and context - root', t => {
  const state = s({ first: { second: 'a' } })
  const app = render({
    types: {
      basic: {
        tag: 'p',
        first: {
          $: 'root.first',
          text: { $: 'second' }
        },
        second: { text: 'b' }
      }
    },
    text: { $: 'root.first.second' },
    basic: { type: 'basic' }
  }, state)

  t.equal(
    p(app),
    '<div>a<p><div>a</div><div>b</div></p></div>',
    'correct initial html'
  )

  state.first.set(null)
  t.equal(
    p(app),
    '<div><p><div>b</div></p></div>',
    'removed node'
  )
  t.end()
})

test('remove - counter', t => {
  var cnt = 0
  const state = s({
    first: { second: 'a' },
    a: {
      b: {
        c: 'w0000t'
      }
    }
  })
  const app = render({
    a: {
      $: 'first',
      b: {
        text: { $: 'second' }
      }
    },
    gurk: {
      tag: 'fragment',
      $: 'a.b',
      hello: {
        text: { $: 'c' }
      }
    },
    text: { $: 'a.b.c' }
  }, state, (subs, tree, elem, s, type, su, t) => {
    cnt++
  })

  t.equal(
    p(app),
    '<div><div><div>a</div></div><div>w0000t</div>w0000t</div>',
    'correct initial html'
  )

  cnt = 0
  state.first.set(null)
  t.equal(cnt, 1, 'fires once')
  t.equal(
    p(app),
    '<div><div>w0000t</div>w0000t</div>',
    'removed node'
  )
  state.a.b.set(null)
  t.equal(
    p(app),
    '<div></div>',
    'removed text'
  )
  t.end()
})
