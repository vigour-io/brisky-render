'use strict'
const render = require('../../render')
const test = require('tape')
const parse = require('parse-element')
const strip = require('vigour-util/strip/formatting')
const s = require('vigour-state/s')

test('any - switch - type', function (t) {
  console.error('now we will fuck it up')
  const state = s({
    holder: {
      val: 'text',
      title: 'xxxx'
    }
  })

  const app = render({
    $: 'holder',
    types: {
      page: {
        tag: 'switcher',
        $: '$switch',
        $switch: (val) => {
          console.log('SWITCH', val.path().join('/'))
          return 'sameAsAlways'
        },
        properties: {
          sameAsAlways: {
            tag: 'same',
            text: { $: 'title' }
          }
        }
      }
    },
    page: {
      type: 'page'
    }
  }, state)

  document.body.appendChild(app)

  t.same(
    parse(app),
    strip(`
      <div>
        <div>
          <div>
            <div>1</div>
          </div>
          <div>
            <div>2</div>
          </div>
        </div>
      </div>
    `)
  )

  t.end()
})
