'use strict'
const props = require('../render/static').property
const getParent = require('../render/dom/parent')
const vstamp = require('vigour-stamp')

exports.types = {
  group: {
    type: 'property',
    isGroup: true,
    properties: {
      render (render) {
        this.define({ groupRender: { val: render } })
      }
    },
    subscriptionType: true,
    define: {
      render: {
        val: {
          static (target, pnode) {
            const store = []
            target.groupRender.static(target, pnode, store)
          },
          state (target, state, type, stamp, subs, tree, id, pid) {
            // console.log('go go go')
            let storeId = pid + target.key
            const store = tree._[storeId] || (tree._[storeId] = {})
            const pnode = getParent(type, stamp, subs, tree, pid)
            const parsed = '_' + target.key + 'StaticParsed'

            // if (pnode) {
            if (!pnode[parsed]) {
              props(target, pnode, store)
              pnode[parsed] = true
            }
            if (!('stamp' in store)) {
              store.stamp = stamp
              vstamp.on(stamp, () => {
                delete store.stamp
                target.groupRender.state(target, state, type, stamp, subs, tree, id, pid, store)
              })
            }
            // }
          }
        }
      }
    },
    child: {
      define: {
        getStore (tree, id) { // target, state, type, stamp, subs, pid
          if (this.$ !== true) {
            tree = tree._p
            while (!tree.$ && tree._p) {
              tree = tree._p
            }
          }
          const _ = tree._ || (tree._ = {})
          const store = _[id] || (_[id] = {})
          // if (!('stamp' in store)) {
          //   store.stamp = stamp
          //   vstamp.on(stamp, () => {
          //     delete store.stamp
          //     target.groupRender.state(target, state, type, stamp, subs, tree, id, pid, store)
          //   })
          // }
          return store
        }
      },
      render: {
        static (target, node, store) {
          store[target.key] = target.compute()
        },
        state (target, state, type, stamp, subs, tree, id, pid) {
          target.getStore(
            tree, pid + target.cParent().key
            // target.cParent(), state, type, stamp, subs, pid
          )[target.key] = target.compute(state)
        }
      }
    }
  }
}
