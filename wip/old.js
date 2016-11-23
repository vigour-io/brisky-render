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

const n = 2e3

var d = Date.now()
// state.subscribe({ xx: { $any: { val: true } } }, () => {})

console.log(Date.now() - d, 'ms')

global.state = state

var cnt = 0
const update = () => {
  var i = n
  cnt++
  stats.n(n)
  stats.begin()
  var arr = []
  while (i--) { arr.push(i + cnt) }
  state.set({ collection: arr })
  stats.end()
  global.requestAnimationFrame(update)
}
update()
