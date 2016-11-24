'use strict'
const render = require('../../render')
const test = require('tape')
const parse = require('parse-element')
const strip = require('strip-formatting')
const s = require('brisky-struct')
const moons = require('../util/emojis').moons
const nature = require('../util/emojis')

test('$test - $parent', t => {
  const state = s()

  const emojis = {
    $: 'moons.$test',
    $test: {
      val (state, tree) {
        const focus = state.lookUp('focus')
        return focus && focus.compute()
      },
      $: '$parent.$parent.focus'
    },
    child: {
      tag: 'span',
      child: 'Constructor'
    },
    moon: {
      $: 0,
      text: { $: true },
      nature: {
        $: '$parent.$parent.nature',
        text: { $: 0 }
      }
    }
  }

  const types = { emojis }

  var app = render({
    types,
    holder: {
      tag: 'holder',
      $: 'emojis',
      a: { type: 'emojis' },
      text: { $: 'title' },
      b: {
        type: 'emojis',
        $: 'deep.moons.$test'
      }
    }
  }, state)

  state.set({
    emojis: {
      moons: moons,
      nature: nature,
      deep: {
        moons: moons.concat().reverse(),
        nature: nature.concat().reverse()
      }
    }
  })

  t.same(
    parse(app),
    '<div><holder></holder></div>',
    'intial render (empty)'
  )

  // wrong order in node but not in the browser...
  // clone node difference
  state.set({ focus: true })

  t.same(
    parse(app),
    strip(`
    <div>
      <holder>
        <div>
          <span>🌕<span>🐶</span></span>
        </div>
      </holder>
    </div>
    `),
    'set $root.focus to true'
  )

  state.set({ emojis: { focus: true } })

  t.same(
    parse(app),
    strip(`
    <div>
      <holder>
        <div>
          <span>🌕<span>🐶</span></span>
        </div>
        <div>
          <span>🌔<span>💦</span></span>
        </div>
      </holder>
    </div>
    `),
    'set $root.emojis.focus to true'
  )

  state.set({
    emojis: { title: '💩' }
  })

  t.same(
    parse(app),
    strip(`
      <div>
        <holder>
          <div>
            <span>🌕<span>🐶</span></span>
          </div>
          💩
          <div>
            <span>🌔<span>💦</span></span>
          </div>
        </holder>
      </div>
    `),
    'set emoji title'
  )

  if ('body' in document) {
    document.body.appendChild(app)
  }

  state.set({ focus: false, emojis: { focus: false } })

  t.same(
    parse(app),
    '<div><holder>💩</holder></div>',
    'set all focus fields to false'
  )

  t.end()
})

test('$test - $parent + $switch + $any', t => {
  const state = s({
    content: {
      fields: {
        items: {
          a: { number: 1000 },
          b: { number: 1000 }
        },
        text: '$root.text'
      }
    },
    text: '$root.title',
    current: '$root.content.fields',
    title: 'count'
  })
  const elem = {
    holder: {
      tag: 'fragment',
      $: 'current.$switch',
      $switch: (state) => state.key,
      properties: {
        fields: {
          $: 'items.$any',
          child: {
            $: '$test',
            $test: (state) => {
              return state.number.compute() > 100
            },
            nested: {
              tag: 'nested',
              text: {
                $: '$parent.$parent.text'
              }
            }
          }
        }
      }
    }
  }
  const app = render(elem, state)
  t.equal(
    parse(app),
    '<div><div><div><nested>count</nested></div><div><nested>count</nested></div></div></div>',
    '$parent.$parent over reference'
  )
  state.title.set('counter')
  t.equal(
    parse(app),
    '<div><div><div><nested>counter</nested></div><div><nested>counter</nested></div></div></div>',
    'update title'
  )
  t.end()
})
