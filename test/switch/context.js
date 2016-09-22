'use strict'
const render = require('../../render')
const test = require('tape')
const parse = require('parse-element')
const strip = require('vigour-util/strip/formatting')
const s = require('vigour-state/s')

test('$switch - one level', function (t) {
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
  t.same(
    parse(app),
    strip(`
      <div>
        <switcher>
          <same>text</same>
        </switcher>
      </div>
    `),
    'one level context'
  )
  t.end()
})

test('$switch - deep', function (t) {
  const state = s({
    holder: { val: 'text' }
  })
  const app = render({
    $: 'holder',
    key: 'app',
    types: {
      page: {
        tag: 'page',
        switcher: {
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
      }
    },
    page: {
      type: 'page'
    }
  }, state)
  t.same(
    parse(app),
    strip(`
      <div>
        <page>
          <switcher>
            <same>text</same>
          </switcher>
        </page>
      </div>
    `),
    'deep context'
  )
  if (document.body) {
    document.body.appendChild(app)
  }
  t.end()
})
