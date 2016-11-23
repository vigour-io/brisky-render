const struct = require('brisky-struct')
const render = require('../render')

const elem = render({
  bla: {
    bla: {
      bla: true
    },
    text: 'hello'
  }
}, struct({ x: 'x!' }))

console.log(elem)
