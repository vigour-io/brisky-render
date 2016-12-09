const widgets = require('./widgets')

exports.props = {
  isWidget: {
    type: 'property',
    subscriptionType: 1,
    $: true,
    render: {
      // just use this vs other stuff
      // maybe make parent a method of element getParentNode(pid)
      // or allways add the parent vs pid
      state (target, s, type, subs, tree, id, pid) {
        if (type === 'new') {
          widgets.push(target.parent(), pid, tree)
        }
        // just handle remove here no where else... call render when widget nothing else
      }
    }
  }
}
