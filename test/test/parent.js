'use strict'
const render = require('../../render')
const test = require('tape')
const parse = require('parse-element')
const strip = require('vigour-util/strip/formatting')
const s = require('vigour-state/s')
const moons = require('../util/emojis').moons
const nature = require('../util/emojis')

test('$test - $parent', function (t) {
  const state = s()

  const emojis = {
    $: 'moons.$test',
    $test: {
      val (state, tree) {
        console.log(state.parent.parent.path(), tree)
        return true
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

    // wrong order in node but not in the browser...
  // clone node difference
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
    'parses parent /w tests correctly'
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

  console.log('FIRE DAT GUN parent tests condition!')
  state.set({
    emojis: {
      focus: 'blurk!'
    }
  })

  console.log('FIRE FIRE')
  state.set({
    focus: 'hello'
  })

    // t.same(
    //   parse(app),
    //   '<div><holder><first></first></holder></div>',
    //   'correct html on intial state'
    // )
    // t.same(
    //   parse(app),
    //   '<div><holder></holder></div>',
    //   'set state.fields.first to false'
    // )

  t.end()
})
