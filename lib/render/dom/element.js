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
  state (target, state, type, stamp, subs, tree, id, pid) {
    var domNode = tree._ && tree._[id]
    var pnode
    if (type === 'remove') {
      if (domNode) {
        pnode = getParent(type, stamp, subs, tree, pid)
        if (pnode) {
          if (target.tag === 'fragment') {
            for (let i = 3, len = domNode.length; i < len; i++) {
              pnode.removeChild(domNode[i])
            }
          } else if (!target._emitters.removeEmitter) {
            pnode.removeChild(domNode)
          }
        }
        delete tree._[id]
      }
    } else if (!domNode) {
      if (target.tag === 'fragment') {
        console.warn('its a fragment!', id, tree)
      }
      domNode = createState(target, state, type, stamp, subs, tree, id, pid)
    }
    return domNode
  }
}
