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
      ha: { x: { y: 'ha!' } },
      gur: { z: { type: 'ha' } },
      greeting: { ha: { type: 'gur' } }
    },
    bla: {
      gur: {
        hello: {
          type: 'greeting'
        }
      }
    },
    blar: {
      gur: {
        hello: {
          type: 'greeting'
        }
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
      $: 'bla.gur.hello.ha.z.x.y',
      on: {
        click (e) {
          console.log(e.state.path())
          e.state.set('YES')
          console.log('clikerdiclickclick', e, e.state)
        }
      }
    },
    stuff: {
      text: { $: true },
      style: {
        fontSize: '200px',
        fontFamily: 'SF Ui Display'
      },
      $: 'blar.gur.hello.ha.z.x.y',
      on: {
        click (e) {
          console.log(e.state.path())
          e.state.set('YES')
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
