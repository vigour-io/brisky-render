const { render } = require('../../')
const test = require('tape')
const parse = require('parse-element')
const { create: s } = require('brisky-struct')
const strip = require('strip-formatting')

console.log(s)

test('fragment - basic', t => {
  const state = global.state = s()

  const types = {
    fragment: {
      tag: 'fragment',
      $: 'lulz',
      b: { tag: 'b', $: 'root.b', text: { $: true } },
      static: { text: 'sooo static' },
      c: { text: { $: true, $transform: val => 'frag: ' + val } }
    }
  }

  const app = render(
    {
      types,
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

  state.set({ b: 'its b!' })
  t.equal(parse(app), strip(`
    <div>
      <div>
        <div>---&gt;its static (from lol)</div>
        <b>its b!</b>
        <div>sooo static</div>
        <div>frag: lulz!</div>
      </div>
      static under!
    </div>
  `), 'set $root.b')

  state.set({ b: null })
  t.equal(parse(app), strip(`
    <div>
      <div>
        <div>---&gt;its static (from lol)</div>
        <div>sooo static</div>
        <div>frag: lulz!</div>
      </div>
      static under!
    </div>
  `), 'set $root.b')

  state.set({ b: 'its b!' })

  state.lol.lulz.set(null)

  t.equal(parse(app), strip(`
    <div>
      <div>
        <div>---&gt;its static (from lol)</div>
      </div>
      static under!
    </div>
  `), 'remove fragment')

  state.set({ lol: { lulz: 'lulz!' } })
  t.equal(parse(app), strip(`
    <div>
      <div>
        <div>---&gt;its static (from lol)</div>
        <b>its b!</b>
        <div>sooo static</div>
        <div>frag: lulz!</div>
      </div>
      static under!
    </div>
  `), 're-add fragment')

  t.end()
})
