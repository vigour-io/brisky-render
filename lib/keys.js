'use strict'

// or index what is it? -- may not need order for now ask guys
// exports.sort = 'order'
// exports.properties = {
//   // it is index
//   order: true
// }

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
  }
}

// put these in static or define the types in static or something
function isStaticElement (target) {
  return target && target.isStatic && target.isElement
}

function isStaticProperty (target) {
  return target && !target.isElement && (target.isStatic || target.isGroup)
}
