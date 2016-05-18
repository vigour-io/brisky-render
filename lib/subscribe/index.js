'use strict'
exports.properties = {
  $ (val) {
    if (
      typeof val === 'string' &&
      (val = val.split('.')) ||
      val instanceof Array
    ) {
      let length = val.length
      const last = val[length - 1]
      if (last === '$switch') {
        this.isSwitcher = true
      } else if (last === '$any') {
        this.isCollection = true
        length = length - 1
      } else if (this.isSwitcher) {
        this.isSwitcher = null
      } else if (this.isCollection) {
        this.isCollection = null
      }
      this._$length = length
    } else {
      this._$length = null
    }
    this.$ = val
  },
  _$path: true,
  isStatic: true,
  isSwitcher: true,
  isCollection: true,
  $condition: true,
  isGroup: true,
  defaultSubscription: true,
  map: true,
  render (render) {
    this.define({
      render: { value: render }
    })
  }
}

exports.inject = require('./map')
