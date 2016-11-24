const getParent = require('../render/dom/parent')

exports.props = {
  html: {
    type: 'property',
    render: {
      static (target, node) {
        node.innerHTML = target.compute()
      },
      state  (target, s, type, subs, tree, id, pid) {
        var node = getParent(type, subs, tree, pid)
        if (type === 'remove') {
          // try to make a test for this
          if (node) {
            let val = target.compute()
            node.innerHTML = val !== target ? val : ''
          }
        } else {
          node.innerHTML = target.compute(s)
        }
      }
    }
  }
}
