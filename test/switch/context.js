'use strict'
const render = require('../../render')
const test = require('tape')
const parse = require('parse-element')
const strip = require('vigour-util/strip/formatting')
const s = require('vigour-state/s')

test('$switch - context - one level', function (t) {
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

test('$switch - context - deep', function (t) {
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

test('$switch - context - double', function (t) {
  const state = s({
    a: 'A!',
    field: { nest: '$root.a' },
    flups: {
      c: '$root.field'
    },
    c: '$root.field'
  })
  const app = render({
    types: {
      a: {
        text: { $: true }
      },
      b: {
        text: { $: 'nest', $add: '-B' }
      },
      field: {
        tag: 'x',
        $: 'nest.$switch',
        properties: {
          a: { type: 'a' }
        }
      },
      c2: {
        tag: 'c2',
        bla: {
          tag: 'bla',
          $: 'c.$switch',
          properties: {
            field: { type: 'b' }
          }
        }
      },
      c: {
        tag: 'c',
        $: 'c.$switch',
        properties: {
          field: { type: 'field' }
        }
      }
    },
    c: { type: 'c' },
    c2: { type: 'c2' },
    c3: { tag: 'c3', type: 'c2', $: 'flups' },
    c4: {
      type: 'c2',
      tag: 'c4',
      bla: {
        properties: {
          field: {
            type: 'a',
            tag: 'fragment',
            $: 'nest'
          }
        }
      }
    }
  }, state)

  t.same(
    parse(app),
    strip(`<div>
      <c>
        <x>
          <div>A!</div>
        </x>
      </c>
      <c2>
        <bla>
          <div>A!-B</div>
        </bla>
      </c2>
      <c3>
        <bla>
          <div>A!-B</div>
        </bla>
      </c3>
      <c4>
        <bla>A!</bla>
      </c4>
    </div>`), 'correct ouput')

  if (document.body) {
    document.body.appendChild(app)
  }
  t.end()
})
