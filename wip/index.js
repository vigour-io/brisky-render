const struct = require('brisky-struct')
const render = require('../render')
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
        text: '!!!!!!',
        blurx: { text: 'its blurx' }
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

console.log(app)
document.body.appendChild(app)

state.x.set('!!!!')

var i = 1e4
var arr = []
while (i--) {
  arr.push(i)
}

state.set({
  xx: [ 1, 2, 3 ]
})

// state.subscribe({ xx: { $any: true } }, () => {})

var d = Date.now()
state.set({ collection: arr })
console.log(Date.now() - d, 'ms')

global.state = state
