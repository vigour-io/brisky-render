'use strict'
const get = require('lodash.get')

exports.static = function staticAppendNode (target, pnode, domNode) {
  const parent = target._parent
  if (!parent.isStatic) {
    const keys = parent.keys()
    // =============================
    const index = keys.indexOf(target.key)
      // =============================
    if (keys[index - 1]) {
      if (!parent[keys[index - 1]].isStatic) {
        target.staticIndex = pnode.childNodes.length
        domNode._staticIndex = target.staticIndex
      }
    }
    // call it index (same)
    pnode.__order = index
  }
  pnode.appendChild(domNode)
}

exports.state = function stateAppendNode (target, pnode, domNode, subs, tree, uid) {
  if (!before(target, domNode, pnode, subs, tree, uid)) {
    pnode.appendChild(domNode)
  }
}

function before (target, domNode, pnode, subs, tree, uid) {
  // =============================
  if (!('key' in target)) { return }
  const order = target.cParent().keys().indexOf(target.key)
  const index = pnode.__order
  // =============================
  if (order !== -1) {
    if (index > order) {
      const parent = target.cParent()
      const keys = parent.keys()
      // =============================
      let i = order
      // =============================
      let nextchild
      let nextNode
      const cl = subs._.cl
      while ((nextchild = parent[keys[++i]])) {
        if (nextchild.isElement) {
          if (nextchild.staticIndex !== void 0) {
            nextNode = findStaticNode(pnode, nextchild.staticIndex)
          } else {
            if (nextchild.isStatic) {
              throw new Error('order - isStatic and no staticIndex ' + nextchild.inspect() + ' ' + nextchild.path())
            } else {
              nextNode = findNode(cl && cl[uid] || nextchild._uid, tree, target, nextchild)
            }
          }
          if (nextNode) {
            pnode.insertBefore(domNode, nextNode)
            return true
          }
        }
      }
    }
    pnode.__order = order
  }
}

function findNode (uid, tree, target, nextchild) {
  const len = target._$length
  const nextchild$ = nextchild.$
  if (len > 1) {
    for (let i = len; i > 0; i--) {
      tree = tree._p
    }
  } else if (target.$ && target.$ !== true) {
    tree = tree._p
  }

  if (nextchild._$length > 1) {
    let resultTree
    if (nextchild.$any || nextchild.$switch) {
      resultTree = get(tree, nextchild$.slice(0, -1))
    } else {
      resultTree = get(tree, nextchild$)
    }
    return resultTree && resultTree._[uid]
  } else if (nextchild$ && nextchild$ !== true) {
    let key = nextchild$[0]
    if (/^\$test/.test(key)) {
      console.log('special test case')
      key = '$pass'
    }
    return tree[key] && tree[key]._[uid]
  } else {
    return tree._[uid]
  }
}

function findStaticNode (pnode, staticIndex) {
  var arr = pnode.childNodes
  for (let i = 0, len = arr.length; i < len; i++) {
    let j = staticIndex + i
    if (arr[j] && arr[j]._staticIndex === staticIndex) {
      return arr[j]
    } else if (i !== 0) {
      j = staticIndex - i
      if (arr[j] && arr[j]._staticIndex === staticIndex) {
        return arr[j]
      }
    }
  }
}
