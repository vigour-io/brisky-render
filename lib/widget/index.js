'use strict'
const widgets = require('./widgets')

exports.properties = {
  isWidget: {
    subscriptionType: 1,
    $: true,
    render: {
      state (target, state, type, stamp, subs, tree, id, pid) {
        console.error('add widget!', target.cParent(), pid, tree)
        if (type === 'new') {
          widgets.push(target.cParent(), pid, tree)
        }
      }
    }
  }
}
