const http = require('http')
const fs = require('fs')
const zlib = require('zlib')
const { parse } = require('url')
const path = require('path')

const render = require('../dist/render')
const state = require('../dist/state')
const appEnvs = JSON.parse(fs.readFileSync(path.join(__dirname, '../dist/app/envs.json')))
const browserEnvs = JSON.parse(fs.readFileSync(path.join(__dirname, '../dist/browser/envs.json')))
const uaParse = require('vigour-ua')

const r = require
require = target => { // eslint-disable-line
  delete r.cache[r.resolve(target)]
  return r(target)
}

function matchEnvs (envs, ua) {
  const field = envs.map['vigour-ua/navigator']
  const files = envs.files
  const ratings = []
  for (let i in files) {
    ratings[rate(files[i][field], ua, 0)] = i
  }
  return ratings[ratings.length - 1]
}

function rate (a, b, count) {
  if (typeof a === 'object' && typeof b === 'object') {
    for (var i in a) {
      count = rate(a[i], b[i], count)
    }
    return count
  }
  return a === b ? count + 1 : count
}

http.createServer((req, res) => {
  const url = parse(req.url)
  const userAgent = req.headers['user-agent']
  const ua = uaParse(userAgent)
  const appfile = matchEnvs(appEnvs, ua)

  global.navigator = { userAgent }

  const app = require('../dist/app/' + appfile)
  const rendered = render(app, state)
  const obj = {}

  res.setHeader('Content-Encoding', 'gzip')

  if (url.path === '/build.js') {
    const buildfile = matchEnvs(browserEnvs, ua)
    const build = fs.readFileSync(path.join(__dirname, '../dist/browser/', buildfile))

    zlib.gzip(build, (err, data) => {
      obj.build = err ? build : data
      res.setHeader('Content-Length', Buffer.byteLength(obj.build))
      res.end(obj.build)
    })
  } else if (url.path === '/favicon.ico') {
    res.end('')
  } else {
    zlib.gzip(rendered, (err, data) => {
      obj.gzip = err ? rendered : data
      res.setHeader('Content-Length', Buffer.byteLength(obj.gzip))
      res.end(obj.gzip)
    })
  }
}).listen(3030)

console.log('start server!', 3030)
