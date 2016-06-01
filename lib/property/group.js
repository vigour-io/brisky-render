'use strict'
const props = require('../render/static').property
const getParent = require('../render/dom/parent')

exports.types = {
  group: {
    type: 'property',
    isGroup: true,
    define: {
      storeStatic (val, pnode) {
        const store = []
        props(this, pnode, store)
        return join(val, store)
      },
      storeState (val, state, type, stamp, subs, tree, id, pid, nojoin) {
        // prob something here with context ids
        const store = tree._[id] || (tree._[id] = [])
        const pnode = getParent(type, stamp, subs, tree, pid)
        const parsed = '_' + this.key + 'StaticParsed'
        if (!pnode[parsed]) {
          props(this, pnode, store)
          pnode[parsed] = true
        }
        // why allways the join? isnt that limiting?
        return !nojoin ? join(val, store) : store
      }
    },
    child: {
      define: {
        getStore (tree, id) {
          if (this.$ !== true) {
            tree = tree._p
            while (!tree.$ && tree._p) {
              tree = tree._p
            }
          }
          const _ = tree._ || (tree._ = {})
          return _[id] || (_[id] = [])
        }
      }
    },
    subscriptionType: 'done'
  }
}

function join (val, store) {
  const l = store.length
  var i = 1
  var str
  if (val && typeof val === 'string') {
    str = store[0] = val
  } else {
    while (i < l) {
      str = store[i++]
      if (str) { break }
    }
  }
  while (i < l) {
    const append = store[i++]
    if (append) { str = str + ' ' + append }
  }
  return str
}
