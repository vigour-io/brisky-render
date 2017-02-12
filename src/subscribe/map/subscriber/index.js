import { puid } from 'brisky-struct'

export default (target, obs, type) => {
  const _ = target._
  var store = _[type] || (_[type] = {})
  var pid, id, parent, index

  id = puid(obs)
  parent = getParent(obs.parent())
  pid = parent && puid(parent)

// }
  index = obs.findIndex(parent)
  if (!store[id]) {
    if (target.$blockRemove !== false) {
      target.$blockRemove = true
    }
    store[id] = obs
    if (type === 's') {
      if (!_.sList) _.sList = []
      _.sList.unshift(id, pid, index, obs)
    }
    if (!_.tList) _.tList = []
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
