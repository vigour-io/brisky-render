'use strict'
const context = require('./context')
const contextId = context.id
const contextOrder = context.order

module.exports = function subscriber (target, obs, type) {
  const _ = target._
  var store = _[type] || (_[type] = {})
  var pid, id, parent, index

  if (obs.__c) {
    parent = getParent(obs.cParent())
    id = contextId(obs)
    pid = parent.__c ? contextId(parent) : parent.uid()
    if (obs.isElement) { contextOrder(_, id, obs, parent) }
  } else {
    id = obs.uid()
    parent = getParent(obs._parent)
    pid = parent && parent.uid()
  }

  if (parent && obs.key) {
    // do this ULTRA efficient
    let calc = parent.keys().indexOf(obs.key)
    if (calc !== -1) {
      index = calc
      console.log('make index', obs.key, parent.keys(), index)
    }
  }

  if (!store[id]) {
    store[id] = obs
    if (type === 'd') {
      if (!_.dList) { _.dList = [] }
      _.dList.unshift(id, pid, index, obs)
    } else {
      if (type === 's') {
        if (!_.sList) { _.sList = [] }
        _.sList.unshift(id, pid, index, obs)
      }
      if (!_.tList) { _.tList = [] }
      _.tList.unshift(id, pid, index, obs)
    }
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
