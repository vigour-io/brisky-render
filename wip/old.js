const State = require('vigour-state')
const render = require('brisky-core/render')
const state = new State({
  x: 'x!',
  collection: [ 1, 2 ]
})

const app = render({
  bla: {
    text: { $: 'x' }
  },
  xxxxx: {
    $: 'collection.$any',
    child: {
      text: '!!!!!!',
      blurx: { text: 'its blurx' }
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
var d = Date.now()
// state.subscribe({ xx: { $any: { val: true } } }, () => {})
state.set({ collection: arr })
console.log(Date.now() - d, 'ms')

global.state = state
