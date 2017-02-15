import { property } from '../render/static'
import parent from '../render/dom/parent'
import bstamp from 'brisky-stamp'
import { get$ } from '../get'

const injectable = {}

// use * to import
export default injectable

injectable.types = {
  group: {
    type: 'property',
    subscriptionType: 1,
    define: {
      render: {
        static (t, pnode) {
          const store = {}
          const parsed = '_' + t.key + 'StaticParsed'
          if (pnode) {
            property(t, pnode, store)
            pnode[parsed] = true
          }
          t.groupRender.static(t, pnode, store)
        },
        state (t, s, type, subs, tree, id, pid, order, store) {
          let storeId = pid + t.key
          if (!store) { store = tree._[storeId] || (tree._[storeId] = {}) }
          const pnode = parent(tree, pid)
          if (pnode) {
            const parsed = '_' + t.key + 'StaticParsed'
            if (!pnode[parsed]) {
              property(t, pnode, store)
              pnode[parsed] = true
            }
            if (!store.inProgress) {
              store.inProgress = true
              bstamp.on(() => {
                delete store.inProgress
                t.groupRender.state(t, s, type, subs, tree, id, pid, store)
              })
            }
          }
        }
      }
    },
    props: {
      render (t, val) {
        t.set({ define: { groupRender: val } })
      },
      default: {
        define: {
          getStore (tree, id) {
            const $ = get$(this)
            if ($) {
              let length = $.length
              // why any lets make a test for this!
              if (this.$any) {
                length--
              }
              while (length) {
                length--
                tree = tree._p
              }
            }
            const _ = tree._ || (tree._ = {})
            const store = _[id] || (_[id] = {})
            return store
          }
        },
        render: {
          static (t, node, store) {
            store[t.key] = t.compute()
          },
          state (t, s, type, subs, tree, id, pid, order) {
            const p = t._p
            const key = p.key
            const store = t.getStore(tree, pid + key)
            if (!s || s.val === null || type === 'remove') {
              if (t.key in store) {
                delete store[t.key]
              }
            } else {
              console.log('??', t.compute(s, s), t.path(), s.path())
              store[t.key] = t.compute(s, s)
            }
            p.render.state(p, s, type, subs, tree, id, pid, order, store)
          }
        }
      }
    }
  }
}
