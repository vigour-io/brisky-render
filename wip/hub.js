const hub = require('hub.js')
const state = hub({
  port: 3031,
  title: 'its fun!',
  bla: 1,
  collection: [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ]
})
console.log('start dat hub')

state.on('error', err => {
  console.log('!', err)
})

const fields = [ 1, 2, 3 ].map((val, key) => {
  return {
    title: 'title' + key,
    description: 'description! ' + key
  }
})

const pages = {
  fields,
  a: { fields: [ '@', 'parent', 'parent', 'fields' ] },
  b: { title: 'ITS B', fields: [ '@', 'parent', 'parent', 'fields' ] }
}

state.set({
  pages
})

// state.subscribe({
//   page: { val: true }
// }, (t, type) => {
//   // console.log('-------->', t.path(), type, t.origin().path())
// })

console.log(state.pages.a.origin() === state.pages.fields)
console.log(state.pages.fields.keys())

var cnt = 0
var dir = 1
function animate () {
  cnt += dir
  if (cnt > 2500 || cnt < 1) { dir = -1 * dir }
  const x = {}
  const w = 1000
  const h = 1000
  var i = 100
  state.collection.forEach((p, key) => {
    x[key] = {
      x: Math.sin(i / 5 + cnt / 40) * w / 3 +
          i * 0.1 + w / 2 +
          Math.cos(i + cnt / (40 - i / 1000)) * 20,
      y: Math.cos(i / 10) * h / 3 +
          i * 0.1 + h / 3 +
          Math.sin(i + cnt / (40 - i / 1000)) * 20
    }
    i++
  })
  state.collection.set(x)
  setTimeout(animate, 10)
}
// animate()
// animate on the hub!
