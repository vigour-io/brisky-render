var d = Date.now()
const struct = require('brisky-struct')
const render = require('../render')
const stats = require('./stats')

const state = struct({
  x: 'x!',
  collection: [ 1, 2 ]
})

const app = render({
  bla: {
    text: { $: 'x' }
  },
  xxxxx: {
    $: 'collection.$any',
    props: {
      default: {
        style: {
          border: '1px solid red',
          background: '#333',
          boxShadow: '10px 10px 10px blue',
          textShadow: '0 0 2px pink'
        },
        text: { $: true },
        blurx: { text: 'its blurx', bla: { text: 'rain' }, blurf: { text: 'again' } }
      }
    }
  },
  blax: {
    tag: 'fragment',
    urk: {
      text: { $: 'x', $transform: val => val + ' jawol fragment' }
    }
  },
  text: 'hello'
}, state)

document.body.appendChild(app)

state.x.set('!!!!')

stats(state)
console.log('TOTAL:', Date.now() - d, 'ms', document.getElementsByTagName('*').length, 'dom elements')
