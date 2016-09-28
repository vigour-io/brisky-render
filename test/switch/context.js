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

/*
exports.types = {
  discoverPage: {
    class: 'flex-column',
    style: { flexShrink: 0 },
    $: 'items.$any',
    child: {
      $: '$switch',
      tag: 'fragment',
      $switch: state => state.rowtype ? state.rowtype.compute() : 'items',
      rowtype: {
        type: 'property',
        $: 'rowtype',
        render: { state () {} }
      },
      properties
    }
  },

  pageSwitcher: {
    properties: {
      discover: {
        type: 'discoverPage'
      }
    }
  }
}

const app = {
  inject: [
    // INJECT THE PAGE SWITCHER BEFORE THE PAGES (youzi)
    require('@vigour-io/play-sidebar'),
    require('@vigour-io/play-page-switcher'),
    require('@vigour-io/play-carousel'),
    require('@vigour-io/play-form'),
    require('@vigour-io/play-horizontal-list'),
    require('@vigour-io/play-icon'),
    require('@vigour-io/play-item'),
    require('@vigour-io/play-page-discover'),
    require('@vigour-io/play-page-header'),
    require('@vigour-io/play-page-shows'),
    require('@vigour-io/play-layout')
  ],

  holder: {
    type: 'layout'
  }
}```

type layout uses type pageSwitcher
*/
