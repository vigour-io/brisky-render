const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const envs = require('rollup-plugin-envs')

module.exports = [{
  entry: './index.js',
  plugins: [
    // {
    //   load (id) {
    //     console.log(id)
    //   }
    // },
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    commonjs()//,
    // envs({
    //   import: [ 'vigour-ua/navigator' ]
    // })
  ],
  dest: 'dist/index.browser.dev.js',
  format: 'iife',
  moduleName: 'wip',
  intro: 'var global = window;'
}]
