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
        const pnode = parent(tree, pid)
        property(t, pnode)
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
            const pnode = parent(tree, pid)
            pnode.top = stripPx(s.compute())
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
            const pnode = parent(tree, pid)
            pnode.left = stripPx(s.compute())
          }
        },
        static (t, node) {
          node.left = stripPx(t.compute())
        }
      }
    },
    width: {
      type: 'property',
      render: {
        state (t, s, type, subs, tree, id, pid) {
          if (type !== 'remove') {
            const pnode = parent(tree, pid)
            if (!pnode.style) pnode.style = {}
            pnode.width = pnode.style.width = stripPx(s.compute())
          }
        },
        static (t, node) {
          if (!node.style) node.style = {}
          node.width = node.style.width = stripPx(t.compute())
        }
      }
    },
    marginTop: {
      type: 'property',
      render: {
        state (t, s, type, subs, tree, id, pid) {
          if (type !== 'remove') {
            const pnode = parent(tree, pid)
            if (!pnode.style) pnode.style = {}
            pnode.marginTop = pnode.style.marginTop = stripPx(s.compute())
          }
        },
        static (t, node) {
          if (!node.style) node.style = {}
          node.marginTop = node.style.marginTop = stripPx(t.compute())
        }
      }
    },
    marginLeft: {
      type: 'property',
      render: {
        state (t, s, type, subs, tree, id, pid) {
          if (type !== 'remove') {
            const pnode = parent(tree, pid)
            if (!pnode.style) pnode.style = {}
            pnode.marginLeft = pnode.style.marginLeft = stripPx(s.compute())
          }
        },
        static (t, node) {
          if (!node.style) node.style = {}
          node.marginLeft = node.style.marginLeft = stripPx(t.compute())
        }
      }
    },
    marginBottom: {
      type: 'property',
      render: {
        state (t, s, type, subs, tree, id, pid) {
          if (type !== 'remove') {
            const pnode = parent(tree, pid)
            if (!pnode.style) pnode.style = {}
            pnode.marginBottom = pnode.style.marginBottom = stripPx(s.compute())
          }
        },
        static (t, node) {
          if (!node.style) node.style = {}
          node.marginBottom = node.style.marginBottom = stripPx(t.compute())
        }
      }
    },
    marginRight: {
      type: 'property',
      render: {
        state (t, s, type, subs, tree, id, pid) {
          if (type !== 'remove') {
            const pnode = parent(tree, pid)
            if (!pnode.style) pnode.style = {}
            pnode.marginRight = pnode.style.marginRight = stripPx(s.compute())
          }
        },
        static (t, node) {
          if (!node.style) node.style = {}
          node.marginRight = node.style.marginRight = stripPx(t.compute())
        }
      }
    },
    paddingTop: {
      type: 'property',
      render: {
        state (t, s, type, subs, tree, id, pid) {
          if (type !== 'remove') {
            const pnode = parent(tree, pid)
            if (!pnode.style) pnode.style = {}
            pnode.paddingTop = pnode.style.paddingTop = stripPx(s.compute())
            if (pnode.text) {
              pnode.requestPaint()
            }
          }
        },
        static (t, node) {
          if (!node.style) node.style = {}
          node.paddingTop = node.style.paddingTop = stripPx(t.compute())
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
            pnode.paddingLeft = pnode.style.paddingLeft = stripPx(s.compute())
            if (pnode.text) {
              pnode.requestPaint()
            }
          }
        },
        static (t, node) {
          if (!node.style) node.style = {}
          node.paddingLeft = node.style.paddingLeft = stripPx(t.compute())
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
            if (pnode.text) {
              pnode.requestPaint()
            }
          }
        },
        static (t, node) {
          if (!node.style) node.style = {}
          node.paddingBottom = node.style.paddingBottom = stripPx(t.compute())
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
            if (!pnode.style) pnode.style = {}
            pnode.paddingRight = pnode.style.paddingRight = stripPx(s.compute())
            if (pnode.text) {
              pnode.requestPaint()
            }
          }
        },
        static (t, node) {
          if (!node.style) node.style = {}
          node.paddingRight = node.style.paddingRight = stripPx(t.compute())
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
            if (!pnode.style) pnode.style = {}
            pnode.height = pnode.style.height = stripPx(s.compute())
          }
        },
        static (t, node) {
          if (!node.style) node.style = {}
          node.height = node.style.height = stripPx(t.compute())
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
