const http = require('http')

const app = require('./index.js')
const parse = require('parse-element')

const mem = parse(app)

http.createServer((req, res) => {
  res.end(mem)
}).listen(3030)
