'use strict'
const render = require('../../render')
const test = require('tape')
const parse = require('parse-element')
const s = require('vigour-state/s')
const strip = require('vigour-util/strip/formatting')

test('collection - mixed', function (t) {
  const state = s({
    field: {
      collection: {
        0: {
          title: '0'
        }
      }
    }
  })

  const app = render({
    main: {
      holder1: {
        tag: 'holder',
        $: 'field.collection.$any',
        child: {
          type: 'text',
          $: 'title'
        }
      },
      holder2: {
        tag: 'holder2',
        $: 'field.collection.0',
        title: {
          text: { $: 'title' }
        }
      },
      holder3: {
        $: 'field',
        tag: 'holder3',
        collection: {
          tag: 'collection',
          $: 'collection.$any',
          child: {
            type: 'text',
            $: 'title'
          }
        }
      }
    }
  }, state)

  t.equal(
    parse(app),
    strip(`
      <div>
        <div>
          <holder>0</holder>
          <holder2>
            <div>0</div>
          </holder2>
          <holder3>
            <collection>0</collection>
          </holder3>
        </div>
      </div>
    `),
    'multiple collections, combined with a non colleciton on the same levels'
  )
  t.end()
})
