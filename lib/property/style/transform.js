'use strict'
const getParent = require('brisky-core/lib/render/dom/parent')
const prefix = require('vigour-ua/navigator').prefix
const transform = prefix ? prefix + 'Transform' : 'transform'
const unit = require('./util').appendUnit

exports.properties = {
  transform: {
    type: 'group',
    render: {
      static (target, node, store) {
        var val = target.compute()
        if (!val || typeof val !== 'string') { val = '' }
        setTransform(val, store, node)
      },
      state (target, s, type, stamp, subs, tree, id, pid, store) {
        var val = s && target.$ ? target.compute(s) : target.compute()
        if (!val || typeof val !== 'string') { val = '' }
        const node = getParent(type, stamp, subs, tree, pid)
        if (node) { setTransform(val, store, node) }
      }
    }
  }
}

function setTransform (val, store, node) {
  if ('x' in store || 'y' in store) {
    let x = store.x || 0
    let y = store.y || 0
    if (x) { x = unit(x, 'px') }
    if (y) { y = unit(y, 'px') }
    const translate3d = `translate3d(${x}, ${y}, 0px)`
    val = val ? (val + ' ' + translate3d) : translate3d
  }

  if ('scale' in store) {
    const scale = `scale(${store.scale})`
    val = val ? (val + ' ' + scale) : scale
  }

  if ('rotate' in store) {
    const rotate = `rotate(${store.rotate}deg)`
    val = val ? (val + ' ' + rotate) : rotate
  }

  node.style[transform] = val
}
