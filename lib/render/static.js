'use strict'

function isStaticElement (t) {
  return t && t.isStatic && t.isElement
}

function isStaticProperty (t) {
  return t && !t.isElement && t.isStatic
}

exports.property = (t, div, param) => {
  console.log('???', t)
  // const props = t.filter(isStaticProperty)
  // // filter 'staticProps'
  // for (let i = 0, len = props.length; i < len; i++) {
  //   let iteratee = t[props[i]]
  //   iteratee.render.static(iteratee, div, param)
  // }
  // return props
}

exports.element = (t, div) => {
  console.log('???', t)
  const elements = t.filter(isStaticElement)
  for (let i = 0, len = elements.length; i < len; i++) {
    // let iteratee = t[elements[i]]
    elements[i].render.static(elements[i], div)
  }
  return elements
}
