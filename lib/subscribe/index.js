'use strict'
const isNumber = require('vigour-util/is/number')
const globSwitch = require('vigour-state/lib/subscribe/switch/glob')
const defaultTest = state => state && state.compute()

exports.properties = {
  $ (val) {
    console.log('????', val)
    if (isNumber(val)) {
      val = [ val + '' ]
    } else if (typeof val === 'string') {
      val = val.split('.')
    }
    if (val instanceof Array) {
      let length = val.length
      const last = val[length - 1]
      if (last === '$any') {
        this.$any = true
        length = length - 1
      } else if (this.$any) {
        this.$any = null
      } else if (last === '$switch') {
        if (!this.$switch) {
          this.$switch = globSwitch
        }
      } else if (this.$switch) {
        this.$switch = null
      } else if (last === '$test') {
        if (!this.$test) {
          this.$test = defaultTest
        }
      } else if (this.$test) {
        this.$test = null
      }
      this._$length = length
    } else {
      this._$length = null
    }
    this.$ = val
  },
  _$path: true,
  isStatic: true,
  $switch: true,
  $any: true,
  $test (val) {
    for (var key in val.$) {
      console.log(key, val.$[key])
    }
    console.error(val, JSON.stringify(val))
    this.$test = val
  },
  sync: true,
  isGroup: true,
  subscriptionType: true,
  render (val) {
    this.define({
      render: { val }
    })
  }
}

exports.subscriptionType = 1
exports.inject = require('./map')
