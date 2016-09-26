'use strict'
const props = require('../render/static').property
const getParent = require('../render/dom/parent')
const vstamp = require('vigour-stamp')

// const perf = require('vigour-performance')
/*
test('type', function (t) {
  function someFunction (a, b) {
    perf.type.test(someFunction, a, b)
  }
  t.plan(2)
  someFunction('hello', 1)
  someFunction([ 1, 2 ], null)
  t.same(perf.type.someFunction, {
    a: { string: 1, array: 1 },
    b: { number: 1, null: 1 }
  }, 'correct measurement')
  perf.type.test('customkey', someFunction, 1, 2)
  t.same(perf.type.customkey, {
    a: { number: 1 },
    b: { number: 1 }
  }, 'works with a custom key')
  t.end()
})
*/

exports.types = {
  group: {
    type: 'property',
    isGroup: true,
    properties: {
      render (val) {
        this.define({ groupRender: { val } })
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
          state (target, s, type, stamp, subs, tree, id, pid) {
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
                  target.groupRender.state(target, s, type, stamp, subs, tree, id, pid, store)
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
        state (target, s, type, stamp, subs, tree, id, pid) {
          const store = target.getStore(tree, pid + target.cParent().key)
          if (s.val === null) {
            if (target.key in store) {
              delete store[target.key]
            }
          } else {
            store[target.key] = target.compute(s)
          }
        }
      }
    }
  }
}
