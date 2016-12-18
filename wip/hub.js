const hub = require('hub.js')
hub({
  port: 3031,
  title: 'its fun!',
  bla: 'OK!',
  collection: {
    a: 'from ze hubs'
  }
})
console.log('start dat hub')
