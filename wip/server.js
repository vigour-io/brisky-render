const http = require('http')
const fs = require('fs')
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

// const bridge = fs.readFileSync(__dirname + '/bridge.min.js').toString()

// console.log(app)
//

// needs to be a seperate one...
// const app = require('./dist/index.prerender.dev.js')
// console.log(a)
// add build as well..

  // ({ exports: {} })
  // fs.writeFileSync(__dirname + '/fn.js', app)
  // console.log('???', app, app({ exports: {} }))

http.createServer((req, res) => {
  // const app = new Function('module', fs.readFileSync(__dirname + '/dist/index.prerender.dev.js') + ';return module.exports;') //eslint-disable-line

  // global.navigator = {
  //   userAgent: req.headers['user-agent']
  // }

  // const a = app({ exports: {} })(global)

  //  ${parseElement(a)}

  const index = `
  <html>
  <head>
  <script>
   document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] +
          ':35729/livereload.js?snipver=1"></' + 'script>');
  </script>
  </head>
  <body>
    <script src="build.min.js"></script>
  </body>
  </html>`

  // const build =
  const build = fs.readFileSync(__dirname + '/dist/index.browser.dev.js') //eslint-disable-line
  const obj = {}

  const url = parse(req.url)
  console.log(url.path)
  res.setHeader('Content-Encoding', 'gzip')
  if (url.path === '/build.min.js') {
    zlib.gzip(build, (err, data) => {
    obj.build = err ? build : data
    res.setHeader('Content-Length', Buffer.byteLength(obj.build))
    res.end(obj.build)
  })

  } else if (url.path === '/favicon.ico') {
    res.end('')
  } else {
     zlib.gzip(index, (err, data) => {
    obj.gzip = err ? index : data
      res.setHeader('Content-Length', Buffer.byteLength(obj.gzip))
    res.end(obj.gzip)
  })


  }
}).listen(3030)

/*
  // dependencies :  { brisky-render, brisky-struct }
  // need build script as well (browerify > build.min.js)
*/
console.log('start server')
