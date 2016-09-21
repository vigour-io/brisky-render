'use strict'
const render = require('../render')
const test = require('tape')
const parse = require('parse-element')
const strip = require('vigour-util/strip/formatting')
const s = require('vigour-state/s')

test('reference - basic', function (t) {
  const state = s({
    holder: {
      fields: {
        thing: 1
      },
      fields2: {
        thing: 2
      },
      current: '$root.holder.fields'
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

test('reference - $any', function (t) {
  const state = s({
    holder: {
      fields: [ 1, 2 ],
      fields2: [ 3, 4 ],
      current: '$root.holder.fields'
    }
  })
  const app = render({
    $: 'holder.current',
    page: {
      $: '$any',
      child: {
        text: { $: true }
      }
    }
  }, state, (subs) => {
    console.log(subs, '?')
  })
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
  console.error('\n\n\nok so what up in this bitch')
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

test('reference - root - $any', function (t) {
  const state = s({
    fields: [ 1, 2 ],
    fields2: [ 3, 4 ],
    current: '$root.fields'
  })
  const app = render({
    $: 'current',
    page: {
      $: '$any',
      child: {
        text: { $: true }
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
