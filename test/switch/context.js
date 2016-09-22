'use strict'
const render = require('../../render')
const test = require('tape')
const parse = require('parse-element')
const strip = require('vigour-util/strip/formatting')
const s = require('vigour-state/s')

test('any - switch - type', function (t) {
  const state = s({
    holder: { val: 'text' }
  })

  const app = render({
    $: 'holder',
    key: 'app',
    types: {
      page: {
        tag: 'switcher',
        $: '$switch',
        $switch: (val) => 'sameAsAlways',
        properties: {
          sameAsAlways: {
            tag: 'same',
            text: { $: true }
          }
        }
      }
    },
    page: {
      type: 'page'
    }
  }, state)

  if (document && document.body) {
    document.body.appendChild(app)
  }

  t.same(
    parse(app),
    strip(`
      <div>
        <switcher>
          <same>text</same>
        </switcher>
      </div>
    `)
  )

  t.end()
})
