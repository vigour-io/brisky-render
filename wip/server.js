const http = require('http')

const app = require('./index.js')
const parse = require('parse-element')
const zlib = require('zlib')

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
const index = `
<html>
<head>
</head>
<body>
  <div id="prerender">
    ${parse(app)}
  </div>
  <script src="http://jim-laptop.local:8080/wip"></script>
</body>
</html>`

const obj = {}
zlib.gzip(index, (err, data) => {
  obj.gzip = err ? index : data
  console.log(obj)
})

// add build as well..
http.createServer((req, res) => {
  res.setHeader('Content-Encoding', 'gzip')
  res.setHeader('Content-Length', Buffer.byteLength(obj.gzip))
  res.end(obj.gzip)
}).listen(3030)

/*
  // dependencies :  { brisky-render, brisky-struct }
  // need build script as well (browerify > build.min.js)
*/
