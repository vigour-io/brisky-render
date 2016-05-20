'use strict'
const test = require('tape')
const render = require('../render')
const s = require('vigour-state/s')

test('widgets', (t) => {
  const state = s({ holder: true })
  let cnt = 0
  render({
    holder: {
      $: 'holder',
      first: {
        isWidget: true,
        on: {
          remove (data, stamp) {
            cnt = cnt + 1
          }
        }
      }
    }
  }, state)

  state.holder.remove()
  t.equals(cnt, 1, 'fired remove listener for widget once')
  t.end()
})
