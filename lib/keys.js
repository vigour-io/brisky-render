'use strict'

// or index what is it? -- may not need order for now ask guys
// exports.sort = 'order'
exports.properties = {
  // it is index
  // order: true
}

exports.define = {
  extend: {
    filterTypes (filterTypes, target, key, type) {
      if (type === 'staticElements') {
        return isStaticElement(target[key])
      } else if (type === 'staticProps') {
        return isStaticProperty(target[key])
      }
      return filterTypes.call(this, target, key, type)
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
