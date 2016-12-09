const render = require('../../render')
const test = require('tape')

test('events - basic', t => {
  const app = render({
    thing: {
      text: 'thing',
      style: {
        fontSize: '200px'
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
