'use strict'
const create = require('./create')
const createState = create.state
const getParent = require('./parent')
const fragment = require('../fragment')
const findParent = fragment.findParent
const isFragment = fragment.isFragment

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
      console.log('HUR', type, node)

      if (node) {
        pnode = getParent(type, stamp, subs, tree, pid)
        if (pnode) {
          if (target.tag === 'fragment') {
            console.log('hur hur')
            if (isFragment(pnode)) {
              pnode = findParent(pnode)
            }

            console.log(node.length, node, pnode)
            for (let i = 1, len = node.length; i < len; i++) {
              if (isFragment(node[i])) {
                // node[i]
                // recursive fin
                for (let j = 1, len = node.length; j < len; j++) {
                  pnode.removeChild(node[i][j])
                }
              }
              pnode.removeChild(node[i])
            }
          } else if (!target._emitters.removeEmitter) {
            if (isFragment(pnode)) {
              // same here of course...
              for (let i = 0, len = pnode.length; i < len; i++) {
                if (pnode[i] === node) {
                  pnode.splice(i, 1)
                  break
                }
              }
              pnode = pnode[0]
            }
            if (isFragment(pnode)) {
              pnode = findParent(pnode)
            }
            // same here
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
