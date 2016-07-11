'use strict'
const create = require('./create')
const createState = create.state
const getParent = require('./parent')

exports.properties = {
  staticIndex: true,
  _cachedtag: true
}

exports.render = {
  static: create.static,
  state (target, state, type, stamp, subs, tree, id, pid, order) {
    var node = tree._ && tree._[id]
    var pnode
    if (type === 'remove') {
      if (node) {
        pnode = getParent(type, stamp, subs, tree, pid)
        if (pnode) {
          if (target.tag === 'fragment') {
            for (let i = 1, len = node.length; i < len; i++) {
              pnode.removeChild(node[i])
            }
          } else if (!target._emitters.removeEmitter) {
            if (pnode instanceof Array) {
              pnode = pnode[0]
            }
            pnode.removeChild(node)
          }
        }
        delete tree._[id]
      }
    } else if (!node) {
      node = createState(target, state, type, stamp, subs, tree, id, pid, order)
    }
    return node
  }
}
