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

test('order - texts', function (t) {
  const state = s({
    fields: '-ha-'
  })
  const app = render(
    {
      properties: {
        field: {
          $: 'fields',
          blurf: {
            text: 'blurf'
          },
          texts: {
            child: { type: 'text', $: true }
          },
          other: {
            $: 'other',
            text: { $: true }
          },
          more: {
            text: 'more!'
          }
        }
      },
      field: {
        texts: [ 1, 2, 3, 4, 5, 6, 7 ]
      }
    },
    state
  )
  state.set({
    fields: {
      other: 'its other!'
    }
  })
  state.set({
    fields: {
      other: null
    }
  })
  state.set({
    fields: {
      other: 'its other!'
    }
  })
  t.same(
    parse(app),
    strip(`
      <div>
        <div>
          <div>blurf</div>
          <div>-ha--ha--ha--ha--ha--ha--ha-</div>
          <div>its other!</div>
          <div>more!</div>
        </div>
      </div>
    `),
    'correct order on sequential sets'
  )
  t.end()
})
