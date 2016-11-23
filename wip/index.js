const struct = require('brisky-struct')
const render = require('../render')

const elem = render({
  bla: {
    bla: {
      bla: true
    }
  }
}, struct({ x: 'x!' }))

console.log(elem)
