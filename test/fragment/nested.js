'use strict'
const render = require('../../render')
const test = require('tape')
const parse = require('parse-element')
const s = require('vigour-state/s')

test('fragment - nested', function (t) {
  const state = global.state = s({
    title: 'its a title',
    fields: {
      a: { title: 'a' },
      b: false
    }
  })

  const app = render(
    {
      switcher: {
        tag: 'fragment',
        $: 'nav.$switch',
        properties: {
          title: {
            $: true,
            tag: 'fragment',
            text: '¯\_(ツ)_/¯' // eslint-disable-line
          },
          fields: {
            tag: 'fragment',
            $: '$any',
            child: {
              $: '$test',
              tag: 'fragment',
              text: { $: 'title' }
            }
          }
        }
      }
    },
    state
  )

  if ('body' in document) {
    document.body.appendChild(app)
  }
  state.set({ nav: '$root.title' })
  t.equal(parse(app), '<div>¯\_(ツ)_/¯</div>', 'initial subscription') // eslint-disable-line
  state.set({ nav: '$root.fields' })
  t.equal(parse(app), '<div>a</div>', 'switch')
  t.end()
})
