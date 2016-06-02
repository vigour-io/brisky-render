'use strict'
const get = require('lodash.get')

exports.static = function staticAppendNode (target, pnode, domNode) {
  const parent = target._parent
  var frag
  if (pnode instanceof Array) {
    if (!parent.isStatic) {
      console.error('FRAG - static and parent is not static need to special handle this!')
    } else {
      console.log('static frag als need to do special tricks')
    }
    // console.log('yo yo yo', pnode)
    frag = pnode
    pnode = pnode[0]
  }
  // so what we can do is just use the frag index first or add the static and a frag index
  // so shares the frag index
  if (!parent.isStatic) {
    var keys, index

    if (frag) {
      console.log('static frag do tricks')
      index = frag[2]
      keys = frag[1]
    } else {
      keys = parent.keys()
      index = keys.indexOf(target.key)
    }
    // handle frag stuff as well but not now wait a bit

    if (keys[index - 1]) {
      if (!parent[keys[index - 1]].isStatic) {
        target.staticIndex = pnode.childNodes.length
        domNode._staticIndex = target.staticIndex
      }
    }
    // call it index (same)
    // console.log(domNode._staticIndex, pnode.__oder)
    pnode.__order = index
  }
  pnode.appendChild(domNode)
}

exports.state = function stateAppendNode (target, pnode, domNode, subs, tree, uid) {
  if (!before(target, domNode, pnode, subs, tree, uid)) {
    // fix this ---- need ot insertbefore in a special way
    pnode.appendChild(domNode)
  }
}

function before (target, domNode, pnode, subs, tree, uid) {
  // =============================
  if (!('key' in target)) { return }
  // this is wrong ofcourse since you never know... may create problems
  // cparent is unreliable here
  const parent = target.cParent()

  if (parent.tag === 'fragment') {
    console.error('different ballgame fragment times')
  }

  if (target.tag === 'fragment') {
    'adding fragment order it!'
  }

  const order = parent.keys().indexOf(target.key)
  const index = pnode.__order
  // =============================
  if (order !== -1) {
    if (index > order) {
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
  var len = target._$length

  if (len && /^\$switch/.test(target.$[len - 1])) {
    len = len - 1
  }

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
      console.log('  --- special test case $test in order -- check this')
      // key + extension else it does not work
      key = '$pass' + key.slice(5)
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
