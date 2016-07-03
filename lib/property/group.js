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
    define: {
      render: {
        val: {
          static (target, pnode) {
            const store = {}
            const parsed = '_' + target.key + 'StaticParsed'
            if (pnode) {
              props(target, pnode, store)
              pnode[parsed] = true
            }
            target.groupRender.static(target, pnode, store)
          },
          state (target, state, type, stamp, subs, tree, id, pid) {
            let storeId = pid + target.key
            const store = tree._[storeId] || (tree._[storeId] = {})
            const pnode = getParent(type, stamp, subs, tree, pid)
            const parsed = '_' + target.key + 'StaticParsed'
            if (pnode) {
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
            }
          }
        }
      }
    },
    child: {
      define: {
        getStore (tree, id) {
          if (this.$ !== true) {
            let length = this.$.length
            if (this.$switch || this.$any || this.$test) {
              length = length - 1
            }
            while (length) {
              if (!/^\$pass|\$current/.test(tree._key)) {
                length--
              }
              tree = tree._p
            }
          }
          const _ = tree._ || (tree._ = {})
          const store = _[id] || (_[id] = {})
          return store
        }
      },
      render: {
        static (target, node, store) {
          store[target.key] = target.compute()
        },
        state (target, state, type, stamp, subs, tree, id, pid) {
          const store = target.getStore(tree, pid + target.cParent().key)
          if (state.val === null) {
            if (target.key in store) {
              delete store[target.key]
            }
          } else {
            store[target.key] = target.compute(state)
          }
        }
      }
    }
  }
}

// 55,70,71
