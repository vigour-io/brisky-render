'use strict'

exports.property = function (target, div, param) {
  const props = target.keys('staticProps')
  for (let i = 0, len = props.length; i < len; i++) {
    let iteratee = target[props[i]]
    iteratee.render.static(iteratee, div, param)
  }
  return props
}

exports.element = function (target, div) {
  const elements = target.keys('staticElements')
  for (let i = 0, len = elements.length; i < len; i++) {
    let iteratee = target[elements[i]]
    iteratee.render.static(iteratee, div)
  }
  return elements
}
