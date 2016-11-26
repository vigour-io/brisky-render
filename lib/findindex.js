const { get$any } = require('./subscribe/map/get')
const { tag } = require('./get')
const { get } = require('brisky-struct/lib/get')

exports.define = {
  findIndex (parent) {
    if (parent) {
      if (this.indexProperty) {
        return this.indexProperty.findIndex(parent)
      } else {
        if (!get$any(parent)) {
          const key = get(this, 'key')
          if (key !== void 0 && key !== null) {
            const keys = parent.keys()
            if (keys) {
              const len = keys.length
              if (len > 1) {
                for (let i = 0; i < len; i++) {
                  if (keys[i] === key) {
                    if (tag(parent) === 'fragment') {
                      return (parent.findIndex(parent.parent()) || 1) + ((i + 1) / (len + 1)).toFixed(len + ''.length)
                    } else {
                      return i + 1
                    }
                  }
                }
              }
            }
          }
        }
        if (tag(parent) === 'fragment') {
          return parent.findIndex(parent.parent())
        }
      }
    }
  }
}
