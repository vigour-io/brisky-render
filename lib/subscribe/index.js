'use strict'
// const globSwitch = require('vigour-state/lib/subscribe/switch/glob') // need to readd this
// const defaultTest = state => state && state.compute()

exports.props = {
  $ (t, val) {
    if (!isNaN(val)) {
      val = [ val + '' ]
    } else if (typeof val === 'string') {
      val = val.split('.')
    }
    // if (val instanceof Array) {
    //   let length = val.length
    //   const last = val[length - 1]
    //   if (last === '$any') {
    //     this.$any = true
    //     length = length - 1
    //   } else if (this.$any) {
    //     this.$any = null
    //   } else if (last === '$switch') {
    //     if (!this.$switch) {
    //       this.$switch = globSwitch
    //     }
    //   } else if (this.$switch) {
    //     this.$switch = null
    //   } else if (last === '$test') {
    //     if (!this.$test) {
    //       this.$test = defaultTest
    //     }
    //   } else if (this.$test) {
    //     this.$test = null
    //   }
    //   this._$length = length
    // } else {
    //   this._$length = null
    // }
    t.$ = val
  },
  // _$path: true,
  isStatic: true,
  // $switch: true,
  $any: true,
  // $test (val) {
    // this.$test = val
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
