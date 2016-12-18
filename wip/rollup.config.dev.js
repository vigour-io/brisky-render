import resolve from 'rollup-plugin-node-resolve'
// import builtins from 'rollup-plugin-node-builtins'
import commonjs from 'rollup-plugin-commonjs'
// import buble from 'rollup-plugin-buble'
// import fs from 'fs'

export default {
  entry: './index.js',
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    commonjs()
    // buble()
  ],
  targets: [
    {
      dest: 'dist/index.browser.dev.js',
      format: 'iife',
      moduleName: 'wip',
      intro: `
        var global = window;
      `
    }
  ]
}
