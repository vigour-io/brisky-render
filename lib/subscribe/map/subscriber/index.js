const context = require('./context')

module.exports = (target, obs, type) => {
  const _ = target._
  var store = _[type] || (_[type] = {})
  var pid, id, parent, index

  if (obs.context) {
    parent = getParent(obs.parent())
    id = context(obs)
    pid = parent.context ? context(parent) : parent.uid()
  } else {
    id = obs.uid()
    parent = getParent(obs.parent())
    pid = parent && parent.uid()
  }
  index = obs.findIndex(parent)
  if (!store[id]) {
    store[id] = obs
    if (type === 's') {
      target.$blockRemove = true
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
