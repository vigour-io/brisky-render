'use strict'
const { render } = require('../../')
const test = require('tape')
const parse = require('parse-element')
const { create: struct } = require('brisky-struct')
const strip = require('strip-formatting')
const { element } = require('../../')

test('order - context', t => {
  const state = struct({
    row: {
      icon: 'lulz',
      info: 'haha'
    }
  })

  const elem = element.create({
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
    props: { default: { type: 'specialRow' } },
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

  state.row.icon.set(null)

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

test('order - context - texts', t => {
  const state = struct({ fields: '-ha-' })
  const app = render(
    {
      props: {
        field: {
          $: 'fields',
          blurf: {
            text: 'blurf'
          },
          texts: {
            props: { default: { type: 'text', $: true } }
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
