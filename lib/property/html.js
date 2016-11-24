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
            let val = t.compute()
            node.innerHTML = val !== t ? val : ''
          }
        } else {
          node.innerHTML = t.compute(s)
        }
      }
    }
  }
}
