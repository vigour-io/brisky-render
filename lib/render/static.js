'use strict'

function isStaticElement (t) {
  return t && t.isStatic && t.isElement
}

function isStaticProperty (t) {
  return t && !t.isElement && t.isStatic
}

exports.property = (t, div, param) => {
  const props = t.staticProps || (t.staticProps = t.filter(isStaticProperty))
  for (let i = 0, len = props.length; i < len; i++) {
    let iteratee = t[props[i]]
    iteratee.render.static(iteratee, div, param)
  }
  // return props
}

exports.element = (t, div) => {
  const elements = t.staticElements || (t.staticElements = t.filter(isStaticElement))
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].render.static(elements[i], div)
  }
  return elements
}
