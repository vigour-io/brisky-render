'use strict'
require('html-element')
const descriptors = require('vigour-util/descriptors')
const parseStatic = require('../../../static')
const props = parseStatic.property
const elems = parseStatic.element
const htmlElement = global.Element.prototype
const outerHTML = descriptors(htmlElement).outerHTML

Object.defineProperty(htmlElement, 'outerHTML', {
  set: outerHTML.set,
  get () {
    let torder
    if (this.__order) {
      torder = this.__order
      this.__order = null
      let val = outerHTML.get.call(this)
      this.__order = torder
      return val
    } else {
      return outerHTML.get.call(this)
    }
  }
})

Object.defineProperty(htmlElement, 'fastRender', {
  value: function () {
    var keys = Object.keys(this.attributes)
    console.log(keys)
  }
})

exports.static = exports.state = renderElement

function renderElement (target, type, stamp, subs, tree, id, pnode) {
  const node = document.createElement(target.tag)
  props(target, node)
  elems(target, node)
  if (!target.isStatic) { tree._[id] = node }
  return node
}
