var d = Date.now()
const struct = require('brisky-struct')
const render = require('brisky-render')
const stats = require('./stats')

const state = struct({ collection: [ 1, 2 ] })

const app = render({
  collection: {
    $: 'collection.$any',
    props: {
      default: {
        style: {
          border: 'rgb(84, 206, 177)',
          margin: '5px',
          background: 'rgb(38, 50, 56)',
          color: 'rgb(128, 203, 196)',
          fontFamily: 'courier',
          textAlign: 'center',
          padding: '10px'
        },
        text: { $: true },
        field: { text: 'static text' },
        other: { text: 'other field' },
        field2: { text: 'static text' },
        field3: { text: 'static text' }
      }
    }
  }
}, state)

stats(state)

module.exports = app

if (document.body) {
  // console.log('lets wait rly long....')
  // setTimeout(() => {
  console.log('re-render')
  const pr = document.getElementById('prerender')
  if (pr) {
    document.body.removeChild(pr)
  }
  document.body.appendChild(app)
  console.log('CREATE TOTAL:', Date.now() - d, 'ms', document.getElementsByTagName('*').length, 'dom elements')
  d = Date.now()
  state.collection[state.collection.keys().length - 1].set('hello')
  console.log('UPDATE ONE:', Date.now() - d, 'ms', document.getElementsByTagName('*').length, 'dom elements')
  d = Date.now()
  state.collection.set(state.collection.map(p => p.compute() + '!'))
  console.log('UPDATE ALL:', Date.now() - d, 'ms', document.getElementsByTagName('*').length, 'dom elements')
  // }, 1e3)
}
