var livereload = require('livereload')
var server = livereload.createServer()
server.watch(__dirname + '/dist/index.browser.dev.js')
