'use strict'
const render = require('../../render')
const test = require('tape')
const parse = require('parse-element')
const s = require('brisky-struct')

test('fragment - nested', t => {
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
            text: '¯\\_(ツ)_/¯' // eslint-disable-line
          },
          fields: {
            tag: 'fragment',
            $: '$any',
            child: {
              $: '$test',
              tag: 'fragment',
              text: { $: 'title' },
              field: {
                text: { $: 'title', $transform: String.toUpperCase }
              },
              bla: {
                tag: 'fragment',
                text: { $: 'title' }
              }
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
  t.equal(parse(app), '<div>¯\\_(ツ)_/¯</div>', 'initial subscription')
  state.set({ nav: '$root.fields' })
  t.equal(parse(app), '<div>a<div>a</div>a</div>', 'switch')
  state.set({ nav: '$root.title' })
  t.equal(parse(app), '<div>¯\\_(ツ)_/¯</div>', 'remove previous')
  t.end()
})

test('fragment - nested - remove', t => {
  const state = global.state = s({
    bla: '¯\\_(ツ)_/¯'
  })
  const app = render(
    {
      a: {
        tag: 'fragment',
        b: {
          tag: 'fragment',
          c: {
            $: 'bla.$test',
            text: { $: true }
          }
        }
      }
    },
    state
  )
  if ('body' in document) {
    document.body.appendChild(app)
  }
  t.equal(parse(app), '<div><div>¯\\_(ツ)_/¯</div></div>', 'initial subscription')
  state.bla.remove()
  t.equal(parse(app), '<div></div>', 'remove state')
  t.end()
})
