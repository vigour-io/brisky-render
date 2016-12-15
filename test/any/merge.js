
import { render } from '../../'
import test from 'tape'
import parse from 'parse-element'
import strip from 'strip-formatting'
import { create as s } from 'brisky-struct'

test('any - merge', t => {
  const app = {
    holder: {
      tag: 'holder',
      $: 'collection.$any',
      props: {
        default: {
          tag: 'span',
          title: { text: { $: 'title' } }
        }
      }
    },
    text: {
      $: 'collection',
      $transform: val => {
        return val.keys().length
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
    strip(`
      <div>
        <holder>
          <span><div>a</div></span>
          <span><div>b</div></span>
        </holder>
        2
      </div>
    `)
  )
  t.end()
})

test('any - merge - multiple collections', t => {
  const simple = {
    types: {
      collection: {
        tag: 'fragment',
        $: 'collection.$any',
        props: {
          default: {
            tag: 'b', title: { tag: 'fragment', text: { $: 'title' } }
          }
        }
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

test('any - merge - multiple collections - scoped sub', t => {
  const simple = {
    types: {
      collection: {
        tag: 'fragment',
        $: '$any',
        props: {
          default: {
            tag: 'b', title: { tag: 'fragment', text: { $: 'title' } }
          }
        }
      }
    },
    nest: {
      $: 'collection',
      holder1: { type: 'collection' },
      holder2: { type: 'collection' }
    }
  }

  const app = render(simple, { collection: [ { title: 1 }, { title: 2 } ] })
  t.equal(
    parse(app),
    '<div><div><b>1</b><b>2</b><b>1</b><b>2</b></div></div>',
    'intial subscription'
  )
  t.end()
})
