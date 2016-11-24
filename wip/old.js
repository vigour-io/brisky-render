var d = Date.now()
const State = require('vigour-state')
const render = require('brisky-core/render')
const stats = require('./stats')

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
      blurx: { text: 'its blurx', bla: { text: 'rain' }, blurf: { text: 'again' } }
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

stats(state)
console.log('TOTAL:', Date.now() - d, 'ms', document.getElementsByTagName('*').length, 'dom elements')
