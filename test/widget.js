'use strict'
const test = require('tape')
const render = require('../render')
const s = require('vigour-state/s')
const parseElement = require('parse-element')

test('widgets', (t) => {
  const state = s({ holder: true })
  var cnt = 0
  render({
    holder: {
      $: 'holder',
      first: {
        isWidget: true,
        on: {
          remove (data, stamp) {
            cnt = cnt + 1
            t.equal(parseElement(data.target), '<div></div>', 'gets node in data.target')
          }
        }
      }
    }
  }, state)

  state.holder.remove()
  t.equal(cnt, 1, 'fired remove listener for widget once')
  t.end()
})
