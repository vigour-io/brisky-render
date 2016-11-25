  'use strict'
  const render = require('brisky-core/render')
  require('brisky-core').prototype.inject(require('../'))
  const test = require('tape')
  const s = require('vigour-state/s')
  const p = require('parse-element')
  const isNode = require('vigour-util/is/node')

  test('context - static and state', function (t) {
    const state = s({
      clients: {
        1: {},
        2: {}
      },
      client: '$root.clients.1'
    })

    const app = render(
      {
        types: {
          dimensions: {
            style: {
              border: '3px solid red',
              width: {
                $: 'width',
                $transform: (val) => val * 0.05
              },
              height: {
                $: 'height',
                $transform: (val) => val * 0.05
              }
            }
          }
        },
        dimensions: { type: 'dimensions', $: 'client' },
        clients: {
          $: 'clients.$any',
          child: { dimensions: { type: 'dimensions' } }
        }
      },
    state
  )

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
    '<div>' +
      '<div style="border: 3px solid red; height: 5px; width: 5px;"></div>' +
      '<div>' +
        '<div>' +
          '<div style="border: 3px solid red; height: 5px; width: 5px;"></div>' +
        '</div>' +
        '<div>' +
          '<div style="border: 3px solid red; height: 10px; width: 10px;"></div>' +
        '</div>' +
      '</div>' +
    '</div>',
    'correct output'
  )

    t.end()
  })

