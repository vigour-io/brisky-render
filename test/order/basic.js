
import { render } from '../../'
import test from 'tape'
import parse from 'parse-element'
import { create as s } from 'brisky-struct'
import strip from 'strip-formatting'

test('order - basic', t => {
  const state = s()
  const app = render(
    {
      state: { $: 'text', text: { $: true } },
      static: { tag: 'p' }
    },
    state
  )
  t.equal(parse(app), '<div><p></p></div>', 'correct initial')
  state.set({ text: 'other text' })
  t.equal(
    parse(app),
    strip(`
      <div>
        <div>other text</div>
        <p></p>
      </div>
    `),
    'updates text'
  )
  t.end()
})

test('order - basic - mixed', t => {
  const state = s()
  const app = render(
    {
      a: { text: 'a' },
      first: { $: 1, text: { $: true } },
      b: { text: 'b' },
      second: { $: 2, text: { $: true } },
      c: { text: 'c' }
    },
    state
  )
  state.set({ 2: 2 })
  t.equal(
    parse(app),
    '<div><div>a</div><div>b</div><div>2</div><div>c</div></div>',
    'initial order'
  )
  state.set({ 1: 1 })

  t.equal(
    parse(app),
    '<div><div>a</div><div>1</div><div>b</div><div>2</div><div>c</div></div>',
    'update second'
  )
  t.end()
})
