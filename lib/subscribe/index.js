'use strict'
// const globSwitch = require('vigour-state/lib/subscribe/switch/glob') // need to readd t
// const defaultTest = state => state && state.compute()

exports.props = {
  $ (t, val) {
    if (!isNaN(val)) {
      val = [ val + '' ]
    } else if (typeof val === 'string') {
      val = val.split('.')
    }
    if (val instanceof Array) {
      let length = val.length
      const last = val[length - 1]
      if (last === '$any') {
        t.$any = true
        length = length - 1
      } else if (t.$any) {
        t.$any = null
      } else if (last === '$switch') {
        // if (!t.$switch) {
        //   t.$switch = globSwitch
        // }
      } else if (t.$switch) {
        // t.$switch = null
      } else if (last === '$test') {
        // if (!t.$test) {
        //   t.$test = defaultTest
        // }
      } else if (t.$test) {
        t.$test = null
      }
      t._$length = length
    } else {
      t._$length = null
    }
    t.$ = val
  },
  // _$path: true,
  isStatic: true,
  // $switch: true,
  $any: true,
  // $test (val) {
    // t.$test = val
  // },
  // sync: true,
  // isGroup: true,
  subscriptionType: true,
  render (t, val) {
    // just true
    // console.log('!', val)
    // t.render = val
    t.set({
      define: {
        render: val
      }
    })
  }
}

exports.subscriptionType = 1
exports.inject = require('./map')
