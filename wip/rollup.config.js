import resolve from 'rollup-plugin-node-resolve'
// import builtins from 'rollup-plugin-node-builtins'
import commonjs from 'rollup-plugin-commonjs'
// import buble from 'rollup-plugin-buble'

export default {
  entry: 'index.js',
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    commonjs()
  ],
  targets: [
    { dest: 'dist/index.js', format: 'cjs' }
  ]
}
