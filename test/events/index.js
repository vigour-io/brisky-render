const render = require('../../render')
const test = require('tape')

test('property - cachedNode + context', t => {
  const app = render({
    thing: {
      text: 'thing',
      style: {
        fontSize: '200px'
      },
      on: {
        click () {
          console.log('clikerdiclickclick')
        }
      }
    }
  })
  if (document.body) {
    document.body.appendChild(app)
  }
  t.end()
})
