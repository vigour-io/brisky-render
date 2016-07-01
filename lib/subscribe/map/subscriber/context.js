'use strict'
exports.id = function (obs) {
  if (obs.storeContextKey) {
    console.log('need this in my test (class style)')
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
