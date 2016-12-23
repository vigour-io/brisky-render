import parent from '../render/dom/parent'

const injectable = {}

export default injectable

injectable.types = {
  html: {
    type: 'property',
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

injectable.props = {
  html: { type: 'html' }
}
