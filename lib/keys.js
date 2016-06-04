'use strict'

const Observable = require('vigour-observable')
const f = Observable.prototype.filterTypes

exports.define = {
  filterTypes (target, key, type) {
    if (type === 'staticElements') {
      return isStaticElement(target[key])
    } else if (type === 'staticProps') {
      return isStaticProperty(target[key])
    }
    return f.call(this, target, key, type)
  },
  findIndex (parent) {
    if (parent) {
      if (!parent.$any) {
        const key = this.key
        if (key !== void 0 && key !== null) {
          const keys = parent.keys()
          const len = keys.length
          if (len > 1) {
            for (let i = 0; i < len; i++) {
              if (keys[i] === key) {
                if (parent.tag === 'fragment') {
                  return (parent.findIndex(parent.cParent()) || 0) + (1 / (i / len))
                } else {
                  return i
                }
              }
            }
          }
        }
      }
      if (parent.tag === 'fragment') {
        return parent.findIndex(parent.cParent())
      }
    }
  }
}

// put these in static or define the types in static or something
function isStaticElement (target) {
  return target && target.isStatic && target.isElement
}

function isStaticProperty (target) {
  return target && !target.isElement && (target.isStatic || target.isGroup)
}
