const struct = require('brisky-struct')
const render = require('../render')
const state = struct({ x: 'x!' })

const elem = render({
  // bla: {
    // bla: {
    //   bla: {
  text: { $: 'x' }
    //   }
    // },
    // text: 'hello'
  // }
}, state)

console.log(elem)
document.body.appendChild(elem)

state.x.set('!!!!')

global.state = state
