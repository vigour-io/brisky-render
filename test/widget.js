const test = require('tape')
const render = require('../render')
const s = require('brisky-struct')

test('widgets', (t) => {
  // do more on remove tests
  const state = s({ holder: true })
  var cnt = 0
  var cnt2 = 0
  render({
    bla: {
      $: 'holder',
      on: {
        remove () {
          cnt2++
          // then we can use this for widgets and nothing else
          // why do we even need this? you can extend render type remove
        }
      }
    },
    holder: {
      $: 'holder',
      first: {
        isWidget: true,
        on: {
          remove (data) {
            cnt++
          }
        }
      }
    }
  }, state)

  state.holder.set(null)
  t.equal(cnt, 1, 'fired remove listener for widget once')
  t.equal(cnt2, 1, 'fired remove listener for non-widget once')
  t.end()
})
