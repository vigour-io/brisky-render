const { render, clearStyleCache } = require('../../')
const test = require('tape')
const { create: s } = require('brisky-struct')
const p = require('parse-element')
const isNode = typeof window === 'undefined'
const strip = require('strip-formatting')

test('context - static and state', t => {
  clearStyleCache()
  const state = s({
    clients: {
      1: {},
      2: {}
    },
    client: [ '@', 'root', 'clients', 1 ]
  })

  const app = render({
    types: {
      dimensions: {
        style: {
          border: '3px solid red',
          width: {
            $: 'width',
            $transform: val => val * 0.05 + 'px'
          },
          height: {
            $: 'height',
            $transform: val => val * 0.05 + 'px'
          }
        }
      }
    },
    dimensions: { type: 'dimensions', $: 'client' },
    clients: {
      $: 'clients.$any',
      props: { default: { dimensions: { type: 'dimensions' } } }
    }
  }, state)

  if (!isNode) { global.document.body.appendChild(app) }

  state.set({
    clients: {
      1: {
        width: 100,
        height: 100
      },
      2: {
        width: 200,
        height: 200
      }
    }
  })

  t.equal(
    p(app),
    strip(`<div>
      <div class=" a" style="height: 5px; width: 5px;"></div>
      <div>
        <div>
          <div class=" a" style="height: 5px; width: 5px;"></div>
        </div>
        <div>
          <div class=" a" style="height: 10px; width: 10px;"></div>
        </div>
      </div>
      <style> .a {border:3px solid red;} </style>
    </div>
    `),
    'correct output'
  )

  t.end()
})

