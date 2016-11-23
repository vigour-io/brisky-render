const struct = require('brisky-struct')
const render = require('../render')
const state = struct({
  x: 'x!',
  collection: [ 1, 2 ]
})

const elem = render({
  bla: {
    text: { $: 'x' }
  },
  xxxxx: {
    $: 'collection.$any',
    props: {
      default: {
        text: '!!!!!!'
      }
    }
  },
  text: 'hello'
}, state)

console.log(elem)
document.body.appendChild(elem)

state.x.set('!!!!')

global.state = state
