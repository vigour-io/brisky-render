'use strict'
exports.id = contextId
// ----------------- TRY TO REMOVE ORDER/CL ONE CASE -------------------
exports.order = function (_, id, obs, parent) {
  const keys = parent.keys()
  // ---------------------------
  const index = keys.indexOf(obs.key)
  // ---------------------------
  if (index !== void 0) {
    let nextchild = parent[keys[index + 1]]
    if (
      nextchild &&
      nextchild.isElement &&
      !nextchild.isStatic &&
      nextchild.__c &&
      (!_.cl || !_.cl[id])
    ) {
      if (!_.cl) { _.cl = {} }
      _.cl[id] = contextId(nextchild)
    }
  }
}

function contextId (obs) {
  if (obs.storeContextKey) {
    const key = obs.cParent().key
    return key ? 'c' + key + '-' + genCid(obs) : 'c' + genCid(obs)
  } else {
    return 'c' + genCid(obs)
  }
}

function genCid (obs) {
  if (obs.__c) {
    if (obs._cLevel === 1) {
      return obs.uid() + '' + genCid(obs.__c)
    } else {
      return obs.uid() + '' + genCid(obs._parent)
    }
  } else {
    return obs.uid()
  }
}
