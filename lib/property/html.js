const getParent = require('../render/dom/parent')

exports.props = {
  html: {
    type: 'property',
    render: {
      static (t, node) {
        node.innerHTML = t.compute()
      },
      state  (t, s, type, subs, tree, id, pid) {
        var node = getParent(type, subs, tree, pid)
        if (type === 'remove') {
          if (node) {
            const nodes = node.childNodes
            let i = nodes.length
            while (i--) {
              node.removeChild(nodes[i])
            }
          }
        } else {
          const val = t.compute(s)
          if (val === void 0 || typeof val === 'object') {
            const nodes = node.childNodes
            let i = nodes.length
            while (i--) {
              node.removeChild(nodes[i])
            }
          } else {
            node.innerHTML = val
          }
        }
      }
    }
  }
}
