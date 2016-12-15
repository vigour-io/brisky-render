import resolve from 'rollup-plugin-node-resolve'
// import builtins from 'rollup-plugin-node-builtins'
import commonjs from 'rollup-plugin-commonjs'
// import buble from 'rollup-plugin-buble'

export default {
  entry: './index.js',
  plugins: [
    resolve({
      jsnext: true
    }),
    commonjs()
  ],
  targets: [
    {
      dest: 'dist/index.prerender.dev.js',
      format: 'cjs',
      moduleName: 'wip',
      intro: 'function wip (global) {',
      outro: ';return module.exports};module.exports = wip;'
    }
  ]
}
