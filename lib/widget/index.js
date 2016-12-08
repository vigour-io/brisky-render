const widgets = require('./widgets')

exports.props = {
  isWidget: {
    type: 'property',
    subscriptionType: 1,
    $: true,
    render: {
      state (target, s, type, subs, tree, id, pid) {
        console.log('WIDGET')
        if (type === 'new') {
          widgets.push(target.parent(), pid, tree)
        }
      }
    }
  }
}
