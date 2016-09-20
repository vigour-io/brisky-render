'use strict'
const render = require('../../render')
const test = require('tape')
const parse = require('parse-element')
const s = require('vigour-state/s')
const strip = require('vigour-util/strip/formatting')

test('fragment - nested', function (t) {
  const state = global.state = s()

  const app = render(
    {
      holder: {
        $: 'lol',
        frag: { type: 'fragment' },
        statics: {
          text: '--->its static (from lol)'
        }
      },
      text: 'static under!'
    },
    state
  )

  if ('body' in document) {
    document.body.appendChild(app)
  }

  t.equal(parse(app), '<div>static under!</div>', 'initial subscription')

  state.set({ lol: { lulz: 'lulz!' } })

  t.equal(parse(app), strip(`
    <div>
      <div>
        <div>---&gt;its static (from lol)</div>
        <div>sooo static</div>
        <div>frag: lulz!</div>
      </div>
      static under!
    </div>
  `), 'create fragment')

  t.end()
})
