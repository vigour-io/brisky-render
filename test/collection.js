'use strict'
const render = require('../render')
const test = require('tape')

test('collection', function (t) {
  // types
  const app = {
    holder: {
      $: 'collection.$any',
      Child: {
        tag: 'span',
        title: { $: 'title' },
        input: {
          tag: 'input'
          // props: {
            // value: 'hello'
          // }
        },
        on: {
          click (e) {}
        }
      }
    }
  }

  const elem = render(app, {
    collection: [
      { title: 'a' },
      { title: 'b' }
    ]
  })

  console.log(elem.fastRender())

  var d = Date.now()
  // for (let i = 0; i < 1e4; i++) {
  //   elem.innerHTML
  // }
  console.log(Date.now() - d + 'ms')
  t.end()
  // need to exclude those order fields...
  // find an easy solution for that -- maybe if isNode -- define props?
})
