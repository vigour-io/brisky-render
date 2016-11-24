const isStatic = t => t.isStatic || t.inherits && isStatic(t.inherits)

const isStaticElement = t => {
  console.log(t && t.path(), isStatic(t), t.isStatic, t.keys())
  return t && t.isStatic && t.isElement
}

const isStaticProperty = t => {
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
