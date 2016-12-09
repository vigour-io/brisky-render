'use strict'
const test = require('tape')
const trigger = require('../trigger')
const isNode = require('vigour-util/is/node')

test('trigger', (t) => {
  if (isNode) {
    t.pass('skipping event bubbling test')
    t.end()
  } else {
    const div = document.createElement('div')
    document.body.appendChild(div)
    document.addEventListener('click', function () {
      t.pass('event triggered on element in dom, bubbles to document')
      t.end()
    })
    trigger(div, 'click')
  }
})
