import globals from 'rollup-plugin-node-globals'
import resolve from 'rollup-plugin-node-resolve'
import builtins from 'rollup-plugin-node-builtins'
import commonjs from 'rollup-plugin-commonjs'
import buble from 'rollup-plugin-buble'
import { readFileSync } from 'fs'

export default {
  entry: 'lib/index.js',
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    commonjs()
  ],
  targets: [
    // { dest: 'dist/test/index.js', format: 'cjs' },
    // { dest: 'dist/test/index.es.js', format: 'es' },
    {
      dest: 'dist/index.browser.js',
      format: 'es'
    }
  ]
}
