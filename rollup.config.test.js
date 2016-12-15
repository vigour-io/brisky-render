import globals from 'rollup-plugin-node-globals'
import resolve from 'rollup-plugin-node-resolve'
import builtins from 'rollup-plugin-node-builtins'
import commonjs from 'rollup-plugin-commonjs'
import buble from 'rollup-plugin-buble'

export default {
  entry: 'wip/index.js',
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true
    })
  ],
  targets: [
    // { dest: 'dist/test/index.js', format: 'cjs' },
    // { dest: 'dist/test/index.es.js', format: 'es' },
    {
      dest: 'dist/test/index.browser.js',
      format: 'iife',
      moduleName: 'briskyRender',
      sourceMap: true,
      intro: 'var global = window;'
    }
  ]
}
