'use strict'
import { render } from '../'
import test from 'tape'
import parse from 'parse-element'
import strip from 'strip-formatting'
import { create as s } from 'brisky-struct'

test('reference - basic', t => {
  const state = s({
    holder: {
      fields: {
        thing: 1
      },
      fields2: {
        thing: 2
      },
      current: [ '@', 'root', 'holder', 'fields' ]
    }
  })

  const app = render({
    $: 'holder.current',
    page: {
      $: 'thing',
      text: { $: true }
    }
  }, state)

  t.same(
    parse(app),
    strip(`
      <div>
        <div>1</div>
      </div>
    `)
  )

  state.holder.current.set(state.holder.fields2)

  t.same(
    parse(app),
    strip(`
      <div>
        <div>2</div>
      </div>
    `)
  )

  t.end()
})

test('reference - $any', t => {
  const state = s({
    holder: {
      fields: [ 1, 2 ],
      fields2: [ 3, 4 ],
      current: [ '@', 'root', 'holder', 'fields' ]
    }
  })

  const app = render({
    $: 'holder.current',
    page: {
      $: '$any',
      props: {
        default: {
          text: { $: true }
        }
      }
    }
  }, state)

  if (document && document.body) {
    document.body.appendChild(app)
  }

  t.same(
    parse(app),
    strip(`
      <div>
        <div>
          <div>1</div>
          <div>2</div>
        </div>
      </div>
    `)
  )

  state.holder.current.set(state.holder.fields2)

  t.same(
    parse(app),
    strip(`
      <div>
        <div>
          <div>3</div>
          <div>4</div>
        </div>
      </div>
    `)
  )
  t.end()
})

test('reference - root - $any', t => {
  const state = s({
    fields: [ 1, 2 ],
    fields2: [ 3, 4 ],
    current: [ '@', 'parent', 'fields' ]
  })

  const app = render({
    $: 'current',
    page: {
      $: '$any',
      props: {
        default: {
          text: { $: true }
        }
      }
    }
  }, state)

  if (document && document.body) {
    document.body.appendChild(app)
  }

  t.same(
    parse(app),
    strip(`
      <div>
        <div>
          <div>1</div>
          <div>2</div>
        </div>
      </div>
    `)
  )

  state.current.set(state.fields2)

  t.same(
    parse(app),
    strip(`
      <div>
        <div>
          <div>3</div>
          <div>4</div>
        </div>
      </div>
    `)
  )
  t.end()
})
