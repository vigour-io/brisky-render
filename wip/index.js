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
        text: { $: true },
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

const n = 2e3

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
