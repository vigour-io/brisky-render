'use strict'
const { render } = require('../../')
const test = require('tape')
const parse = require('parse-element')
const strip = require('strip-formatting')
const { create: s } = require('brisky-struct')

test('$switch - context - one level', t => {
  const state = s({
    holder: { val: 'text' }
  })
  const app = render({
    $: 'holder',
    key: 'app',
    types: {
      page: {
        $: '$switch',
        $switch: (val) => 'sameAsAlways',
        props: {
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
        <same>text</same>
      </div>
    `),
    'one level context'
  )
  t.end()
})

test('$switch - context - deep', t => {
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
          $: '$switch',
          $switch: (val) => 'sameAsAlways',
          props: {
            sameAsAlways: {
              tag: 'same',
              text: { $: true }
            }
          }
        }
      }
    },
    page: { type: 'page' }
  }, state)
  t.same(
    parse(app),
    strip(`
      <div>
        <page>
          <same>text</same>
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

test('$switch - context - double', t => {
  const state = s({
    a: 'A!',
    field: { nest: [ '@', 'root', 'a' ] },
    flups: {
      c: [ '@', 'root', 'field' ]
    },
    c: [ '@', 'root', 'field' ]
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
        $: 'nest.$switch',
        props: {
          a: { type: 'a' }
        }
      },
      c2: {
        tag: 'c2',
        bla: {
          $: 'c.$switch',
          props: {
            field: { type: 'b' }
          }
        }
      },
      c: {
        $: 'c.$switch',
        props: {
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
        props: {
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
    strip(`
      <div>
        <div>A!</div>
        <c2>
          <div>A!</div>
        </c2>
        <c3>
          <div>A!</div>
        </c3>
        <c4>A!</c4>
      </div>
    `), 'correct ouput')

  if (document.body) {
    document.body.appendChild(app)
  }
  t.end()
})
