const test = require('tape')
const { element } = require('../')

test('context', t => {
  const types = {
    collection: {
      $: 'collection.$any'
    },
    switcher: {
      $: 'navigation.$switch',
      $switch: state => state.origin().key
    }
  }
  const app = element.create({
    types,
    collection: {
      type: 'collection',
      $: 'text',
      text: { $: true }
    },
    switcher: {
      type: 'switcher',
      $: 'text',
      text: { $: true }
    }
  })
  t.equal(app.collection.$any, null, 'remove $any by change of subscription on instance')
  t.equal(app.switcher.$switch, null, 'remove $switch by change of subscription on instance')
  t.end()
})
