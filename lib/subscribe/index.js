'use strict'
const isNumber = require('vigour-util/is/number')

exports.properties = {
  $ (val) {
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
        // overwrite any
      } else if (/^\$switch/.test(last) !== true) {
        if (this.$switch) {
          this.$switch = null
        // overwrite switch
        }
      } else if (!this.$switch) {
        this.$switch = true
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
  $test: true,
  isGroup: true,
  subscriptionType: true,
  render (render) {
    this.define({
      render: { val: render }
    })
  }
}

exports.subscriptionType = 1
exports.inject = require('./map')
