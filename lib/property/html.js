const parent = require('../render/dom/parent')

exports.types = {
  html: {
    type: 'element',
    render: {
      static (t, node) {
        const val = t.compute()
        node.innerHTML = val === void 0 ? '' : val
      },
      state  (t, s, type, subs, tree, id, pid) {
        const node = parent(tree, pid)
        if (type === 'remove') {
          if (node) {
            const nodes = node.childNodes
            let i = nodes.length
            while (i--) {
              node.removeChild(nodes[i])
            }
          }
        } else {
          const val = t.compute(s, s)
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

exports.props = {
  html: {
    type: 'html'
  }
}
