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
    console.warn('right here', type)
    if (type === 'remove') {
      if (node) {
        pnode = getParent(type, stamp, subs, tree, pid)
        if (pnode) {
          if (target.tag === 'fragment') {
            if (isFragment(pnode)) {
              pnode = findParent(pnode)
            }
            removeFragmentChild(node, pnode)
          } else if (!target._emitters.removeEmitter) {
            if (isFragment(pnode)) {
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

function removeFragmentChild (node, pnode) {
  for (let i = 1, len = node.length; i < len; i++) {
    if (isFragment(node[i])) {
      removeFragmentChild(node[i], pnode)
    } else {
      pnode.removeChild(node[i])
    }
  }
}
