'use strict'
const render = require('../render')
const test = require('tape')
const parse = require('parse-element')
const s = require('vigour-state/s')
const strip = require('vigour-util/strip/formatting')
const Element = require('../lib/element')

test('order - basic', function (t) {
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

test('order - context', function (t) {
  const state = s({
    row: {
      icon: 'lulz',
      info: 'haha'
    }
  })

  const elem = new Element({
    types: {
      icon: {
        tag: 'i',
        text: { $: true }
      },
      info: {
        tag: 'info',
        $: 'info',
        text: { $: true }
      },
      row: {
        tag: 'row',
        info: { type: 'info' },
        icon: { type: 'icon' }
      },
      specialRow: {
        type: 'row',
        $: 'row',
        icon: { $: 'icon' }
      }
    },
    child: { type: 'specialRow' },
    row2: { $: 'row2' },
    row: {}
  })

  t.same(elem.row.keys(), [ 'info', 'icon' ], 'correct key order')

  const app = render(elem, state)

  t.equal(
    parse(app),
    strip(`
      <div>
        <row>
          <info>haha</info>
          <i>lulz</i>
        </row>
      </div>
    `),
    'correct inherited order'
  )

  state.row.icon.remove()

  t.equal(
    parse(app),
    strip(`
      <div>
        <row>
          <info>haha</info>
        </row>
      </div>
    `),
    'remove icon'
  )

  state.row.set({ icon: 'icon!' })

  t.equal(
    parse(app),
    strip(`
      <div>
        <row>
          <info>haha</info>
          <i>icon!</i>
        </row>
      </div>
    `),
    're-adding icon'
  )

  state.set({
    row2: { icon: 'icon row2' }
  })

  t.equal(
    parse(app),
    strip(`
      <div>
        <row>
          <i>icon row2</i>
        </row>
        <row>
          <info>haha</info>
          <i>icon!</i>
        </row>
      </div>
    `),
    'add row2'
  )

  t.end()
})
