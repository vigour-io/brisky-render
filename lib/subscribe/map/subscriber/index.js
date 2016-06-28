'use strict'
const context = require('./context')
const contextId = context.id

module.exports = function subscriber (target, obs, type) {
  const _ = target._
  var store = _[type] || (_[type] = {})
  var pid, id, parent, index
  if (obs.__c) {
    parent = getParent(obs.cParent())
    id = contextId(obs)
    pid = parent.__c ? contextId(parent) : parent.uid()
  } else {
    id = obs.uid()
    parent = getParent(obs._parent)
    pid = parent && parent.uid()
  }

  index = obs.findIndex(parent)

  if (!store[id]) {
    store[id] = obs
    if (type === 's') {
      if (!_.sList) { _.sList = [] }
      _.sList.unshift(id, pid, index, obs)
    }
    if (!_.tList) { _.tList = [] }
    _.tList.unshift(id, pid, index, obs)
  }
  return target
}

function getParent (parent) {
  while (parent) {
    if (parent.isElement) {
      return parent
    }
    parent = parent.cParent()
  }
}
