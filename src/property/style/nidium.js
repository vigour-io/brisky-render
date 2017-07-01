import { property } from '../../render/static'
import parent from '../../render/dom/parent'
import { compute } from 'brisky-struct'

const stripPx = val => {
  if (
    typeof val === 'string' &&
    /px$/.test(val)
  ) {
    val = val.slice(0, -2) | 0
  }
  return val
}

const inlineStyle = {
  type: 'property',
  props: { name: true },
  render: {
    static (target, node) {
      if (!node.style) node.style = {}
      node.style[target.name || target.key] = stripPx(target.compute())
      node.requestPaint()
    },
    state (t, s, type, subs, tree, id, pid) {
      if (type !== 'remove') {
        const node = parent(tree, pid)
        if (!node.style) node.style = {}
        var val = stripPx(s ? compute(t, s, s, tree) : compute(t))
        node.style[t.name || (t.key !== 'default' ? t.key : s.key)] = val
        node.requestPaint()
      }
    }
  }
}

const style = {
  type: 'property',
  render: {
    state (t, s, type, subs, tree, id, pid) {
      if (type !== 'remove') {
        property(t, parent(tree, pid))
      }
    },
    static: property
  },
  props: {
    default: inlineStyle,
    top: {
      type: 'property',
      render: {
        state (t, s, type, subs, tree, id, pid) {
          if (type !== 'remove') {
            parent(tree, pid).top = stripPx(s.compute())
          }
        },
        static (t, node) {
          node.top = stripPx(t.compute())
        }
      }
    },
    left: {
      type: 'property',
      render: {
        state (t, s, type, subs, tree, id, pid) {
          if (type !== 'remove') {
            parent(tree, pid).left = stripPx(s.compute())
          }
        },
        static (t, node) {
          node.left = stripPx(t.compute())
        }
      }
    },
    bottom: {
      type: 'property',
      render: {
        state (t, s, type, subs, tree, id, pid) {
          if (type !== 'remove') {
            parent(tree, pid).bottom = stripPx(s.compute())
          }
        },
        static (t, node) {
          node.bottom = stripPx(t.compute())
        }
      }
    },
    right: {
      type: 'property',
      render: {
        state (t, s, type, subs, tree, id, pid) {
          if (type !== 'remove') {
            parent(tree, pid).right = stripPx(s.compute())
          }
        },
        static (t, node) {
          node.right = stripPx(t.compute())
        }
      }
    },
    width: {
      type: 'property',
      render: {
        state (t, s, type, subs, tree, id, pid) {
          if (type !== 'remove') {
            parent(tree, pid).width = stripPx(s.compute())
          }
        },
        static (t, node) {
          node.width = stripPx(t.compute())
        }
      }
    },
    marginTop: {
      type: 'property',
      render: {
        state (t, s, type, subs, tree, id, pid) {
          if (type !== 'remove') {
            parent(tree, pid).marginTop = stripPx(s.compute())
          }
        },
        static (t, node) {
          node.marginTop = stripPx(t.compute())
        }
      }
    },
    marginLeft: {
      type: 'property',
      render: {
        state (t, s, type, subs, tree, id, pid) {
          if (type !== 'remove') {
            parent(tree, pid).marginLeft = stripPx(s.compute())
          }
        },
        static (t, node) {
          node.marginLeft = stripPx(t.compute())
        }
      }
    },
    marginBottom: {
      type: 'property',
      render: {
        state (t, s, type, subs, tree, id, pid) {
          if (type !== 'remove') {
            parent(tree, pid).marginBottom = stripPx(s.compute())
          }
        },
        static (t, node) {
          node.marginBottom = stripPx(t.compute())
        }
      }
    },
    marginRight: {
      type: 'property',
      render: {
        state (t, s, type, subs, tree, id, pid) {
          if (type !== 'remove') {
            parent(tree, pid).marginRight = stripPx(s.compute())
          }
        },
        static (t, node) {
          node.marginRight = stripPx(t.compute())
        }
      }
    },
    paddingTop: {
      type: 'property',
      render: {
        state (t, s, type, subs, tree, id, pid) {
          if (type !== 'remove') {
            const pnode = parent(tree, pid)
            pnode.paddingTop = stripPx(s.compute())
            if (pnode.text) pnode.requestPaint()
          }
        },
        static (t, node) {
          node.paddingTop = stripPx(t.compute())
          if (node.text) {
            node.requestPaint()
          }
        }
      }
    },
    paddingLeft: {
      type: 'property',
      render: {
        state (t, s, type, subs, tree, id, pid) {
          if (type !== 'remove') {
            const pnode = parent(tree, pid)
            if (!pnode.style) pnode.style = {}
            pnode.paddingLeft = stripPx(s.compute())
            if (pnode.text) pnode.requestPaint()
          }
        },
        static (t, node) {
          if (!node.style) node.style = {}
          node.paddingLeft = stripPx(t.compute())
          if (node.text) {
            node.requestPaint()
          }
        }
      }
    },
    paddingBottom: {
      type: 'property',
      render: {
        state (t, s, type, subs, tree, id, pid) {
          if (type !== 'remove') {
            const pnode = parent(tree, pid)
            if (!pnode.style) pnode.style = {}
            pnode.paddingBottom = pnode.style.paddingBottom = stripPx(s.compute())
            if (pnode.text) pnode.requestPaint()
          }
        },
        static (t, node) {
          node.paddingBottom = stripPx(t.compute())
          if (node.text) {
            node.requestPaint()
          }
        }
      }
    },
    paddingRight: {
      type: 'property',
      render: {
        state (t, s, type, subs, tree, id, pid) {
          if (type !== 'remove') {
            const pnode = parent(tree, pid)
            pnode.paddingRight = stripPx(s.compute())
            if (pnode.text) pnode.requestPaint()
          }
        },
        static (t, node) {
          node.paddingRight = stripPx(t.compute())
          if (node.text) {
            node.requestPaint()
          }
        }
      }
    },
    height: {
      type: 'property',
      render: {
        state (t, s, type, subs, tree, id, pid) {
          if (type !== 'remove') {
            const pnode = parent(tree, pid)
            pnode.height = pnode._height = stripPx(s.compute())
          }
        },
        static (t, node) {
          node.height = node._height = stripPx(t.compute())
        }
      }
    },
    transform: {
      type: 'struct',
      props: {
        x: (t, val) => {
          t.parent(2).set({
            left: val
          })
        },
        y: (t, val) => {
          t.parent(2).set({
            top: val
          })
        }
      }
    },
    backgroundColor: (t, val) => {
      t.set({
        background: val
      })
    },
    padding: (t, val) => {
      t.set({
        paddingLeft: val,
        paddingRight: val,
        paddingTop: val,
        paddingBottom: val
      })
    },
    margin: (t, val) => {
      t.set({
        marginLeft: val,
        marginRight: val,
        marginTop: val,
        marginBottom: val
      })
    },
    backgroundImage: (t, val) => {
      const image = val.match(/url\((.*?)\)/)
      if (image) {
        t.set({ image: image[1] })
      }
    },
    sheet: (t, val) => t.parent().set({ sheet: val })
  }
}

export default {
  types: { inlineStyle, style },
  props: {
    style: { type: 'style' },
    sheet: { type: 'style' }
  }
}
