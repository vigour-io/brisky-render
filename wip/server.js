const http = require('http')
const fs = require('fs')
const app = require('./index.js')
const parseElement = require('parse-element')
const zlib = require('zlib')
const { parse } = require('url')
// make small ofc
// const bundle = fs.readFileSync('http://localhost:8081/bundle.js')

// now how to take over existing fields
// maybe when parsing just write something with it? :/

// have to do it effiecient

// reverse map to a tree ?

// take over reverse? --- inital render check if something allreayd exists?

// merge render?

// pretty difficult

// so vs document.createElement youre just finding the correct elements?

// ok so comptess and test it

const bridge = fs.readFileSync(__dirname + '/bridge.min.js').toString()

// const index = `
// <html>
// <head>
// </head>
// <body>
//   <div id="prerender">
//     ${parseElement(app)}
//   </div>
//   <script>${bridge}</script>
//   <script src="build.min.js"></script>
// </body>
// </html>`

const index = `
<html>
<head>
</head>
<body>
  ${parseElement(app)}
  <script>${bridge}</script>
  <script src="http://localhost:8080/wip"></script>
</body>
</html>`

// const index = `
// <html>
// <head>
// </head>
// <body>
//   <script>${bridge}</script>
//   <script src="build.min.js"></script>
// </body>
// </html>`

const build = fs.readFileSync(__dirname + '/build.min.js') //eslint-disable-line

const obj = {}
zlib.gzip(index, (err, data) => {
  obj.gzip = err ? index : data
})

zlib.gzip(build, (err, data) => {
  obj.build = err ? build : data
})

// add build as well..
http.createServer((req, res) => {
  const url = parse(req.url)
  console.log(url.path)
  res.setHeader('Content-Encoding', 'gzip')
  if (url.path === '/build.min.js') {
    res.setHeader('Content-Length', Buffer.byteLength(obj.build))
    res.end(obj.build)
  } else if (url.path === '/favicon.ico') {
    res.end('')
  } else {
    res.setHeader('Content-Length', Buffer.byteLength(obj.gzip))
    res.end(obj.gzip)
  }
}).listen(3030)

/*
  // dependencies :  { brisky-render, brisky-struct }
  // need build script as well (browerify > build.min.js)
*/
