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
        $: 'items.$any',
        child: {
          // do something about the 'undefined key for children'
          tag: 'li',
          text: { $: 'text' },
          // type: 'ul' // its magical but will work!
          inject (li, stamp) {
            li.set({ ul: new li.parent.Constructor() }, stamp)
          }
        }
      }
    },
    ul: { type: 'ul' }
  }

  const state = s({
    items: [
      { text: 'a' },
      {
        text: 'b',
        items: [
          { text: 'a' },
          { text: 'b' }
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
