const resolve = require('rollup-plugin-node-resolve')
const envs = require('rollup-plugin-envs')
const pkg = require('../package.json')
const watch = require('rollup-watch')
const rollup = require('rollup')
const deps = pkg.dependencies

watch(rollup, {
  entry: 'lib/index.js',
  plugins: [
    envs({
      import: [ 'vigour-ua/navigator' ],
      global: [ 'global', 'window', 'process' ]
    }),
    resolve({
      browser: true
    })
  ],
  external: id => deps[id.split('/')[0]],
  dest: 'dist/browser.es.js'
}).on('event', event => {
  console.log(event)
})
