import widgets from './widgets'

const injectable = {}

export default injectable

injectable.props = {
  isWidget: {
    type: 'property',
    subscriptionType: 1,
    $: true,
    render: {
      state (target, s, type, subs, tree, id, pid) {
        if (type === 'new') {
          widgets.push(target.parent(), pid, tree)
        }
      }
    }
  }
}
