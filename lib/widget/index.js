'use strict'
const widgets = require('./widgets')

exports.properties = {
  isWidget: {
    type: 'property',
    subscriptionType: 1,
    $: true,
    render: {
      state (target, state, type, stamp, subs, tree, id, pid) {
        if (type === 'new') {
          widgets.push(target.cParent(), pid, tree)
        }
      }
    }
  }
}
