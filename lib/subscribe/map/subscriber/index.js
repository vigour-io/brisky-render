'use strict'
const context = require('./context')
const contextId = context.id

module.exports = (target, obs, type) => {
  const _ = target._
  var store = _[type] || (_[type] = {})
  var pid, id, parent, index

  if (obs.context) {
    parent = getParent(obs.parent())
    id = contextId(obs)
    pid = parent.context ? contextId(parent) : parent.uid()
  } else {
    id = obs.uid()
    parent = getParent(obs.parent())
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

const getParent = parent => {
  while (parent) {
    if (parent.isElement) {
      return parent
    }
    parent = parent.parent()
  }
}
