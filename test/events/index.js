const render = require('../../render')
const test = require('tape')
const struct = require('brisky-struct')

test('events - basic', t => {
  const app = render({
    thing: {
      text: 'thing',
      style: {
        fontSize: '100px',
        fontFamily: 'SF Ui Display'
      },
      on: {
        click (e) {
          console.log('clikerdiclickclick', e)
        }
      }
    }
  }, {})
  if (document.body) {
    document.body.appendChild(app)
  }
  t.end()
})

test('events - context on state', t => {
  const state = struct({
    types: {
      ha: { x: 'ha!' },
      greeting: { type: 'ha' }
    },
    bla: {
      hello: {
        type: 'greeting'
      }
    }
  })

  const app = render({
    thing: {
      text: { $: true },
      style: {
        fontSize: '200px',
        fontFamily: 'SF Ui Display'
      },
      $: 'bla.hello.x',
      on: {
        click (e) {
          console.log('clikerdiclickclick', e, e.state)
        }
      }
    }
  }, state)

  if (document.body) {
    document.body.appendChild(app)
  }

  t.end()
})
