'use strict'
const render = require('../../render')
const test = require('tape')
// const parse = require('parse-element')
const s = require('vigour-state/s')

test('collection - recursion', (t) => {
  const elem = {
    types: {
      ul: {
        tag: 'ul',
        $: 'items.$any', // make it for '$any'
        child: {
          tag: 'li',
          text: { $: 'text' },
          // type: 'ul' // its magical but will work! -- make it so
          inject (li, stamp) {
            console.log('ONCE')
            li.set({
              ul: new li.parent.Constructor()
            }, stamp)
          }
        }
      }
    },
    ul: { type: 'ul' },
    ul2: { type: 'ul' },
    holder: {
      text: 'holder!',
      ul3: { $: 'items2.$any', type: 'ul' }
    }
  }

  const state = s({
    items: [
      { text: 'a' },
      {
        text: 'b',
        items: [
          { text: 'b.a' },
          {
            text: 'b.b',
            items: [
              { text: 'b.b.a' },
              { text: 'b.b.b' }
            ]
          }
        ]
      }
    ],

    // uses wrong tree here ofc
    items2: [
      { text: '2.a' },
      {
        text: '2.b',
        items: [
          { text: '2.b.a' },
          {
            text: '2.b.b',
            items: [
              { text: '2.b.b.a' },
              {
                text: '2.b.b.b',
                items: [
                  { text: '2.b.b.b.a' },
                  { text: '2.b.b.b.b' }
                ]
              }
            ]
          }
        ]
      }
    ]
  })

  const app = render(elem, state, (s, t, state) => {
    global.s = s
    console.log('render:', state.path())
  })

  if ('document' in global && 'body' in global.document) {
    global.document.body.appendChild(app)
  }

  // console.log(parse(app))
  t.end()
})
