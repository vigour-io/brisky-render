'use strict'
const widgets = require('./widgets')

exports.properties = {
  isWidget: {
    $: true,
    render: {
      state (target, state, type, stamp, subs, tree, id, pid) {
        widgets.push(target.cParent(), pid, tree)
      }
    }
  }
}
