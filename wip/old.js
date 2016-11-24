const State = require('vigour-state')
const render = require('brisky-core/render')
// const stats = require('./stats')

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
      text: { $: true },
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

// stats(state)
