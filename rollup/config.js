const resolve = require('rollup-plugin-node-resolve')
const pkg = require('../package.json')
const deps = pkg.dependencies

module.exports = [{
  entry: 'lib/index.js',
  plugins: [ resolve() ],
  external: id => deps[id.split('/')[0]],
  targets: [
    { format: 'cjs', dest: 'dist/index.js' },
    { format: 'es', dest: 'dist/index.es.js' }
  ]
}, {
  entry: 'lib/index.js',
  plugins: [ resolve({ browser: true }) ],
  external: id => deps[id.split('/')[0]],
  sourceMap: true,
  targets: [
    { format: 'cjs', dest: 'dist/browser.js' },
    { format: 'es', dest: 'dist/browser.es.js' }
  ]
}]
