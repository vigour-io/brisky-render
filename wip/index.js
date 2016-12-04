var d = Date.now()
const struct = require('brisky-struct')
const render = require('../render')
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

document.body.appendChild(app)

stats(state)

console.log('CREATE TOTAL:', Date.now() - d, 'ms', document.getElementsByTagName('*').length, 'dom elements')

d = Date.now()
state.collection[state.collection.keys().length - 1].set('hello')
console.log('UPDATE ONE:', Date.now() - d, 'ms', document.getElementsByTagName('*').length, 'dom elements')

d = Date.now()
state.collection.set(state.collection.map(p => p.compute() + '!'))
console.log('UPDATE ALL:', Date.now() - d, 'ms', document.getElementsByTagName('*').length, 'dom elements')
