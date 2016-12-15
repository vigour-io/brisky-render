import test from 'tape'
import { render, element } from '../'

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

test('context - storeContextKey', t => {
  var subs

  const types = {
    title: {
      storeContextKey: true,
      tag: 'h1',
      text: { $: 'title' }
    },
    item: {
      title: { type: 'title' }
    }
  }
  const app = {
    types,
    item1: { type: 'item' },
    item2: { type: 'item' }
  }

  render(app, { title: 'its an app' }, s => { subs = s })

  const keys = Object.keys(subs._.t)

  const findKey = key => {
    for (let i in keys) {
      if (keys[i].indexOf(key) !== -1) {
        return true
      }
    }
  }

  t.equal(findKey('item1'), true, 'stores item1 in tree-key')
  t.equal(findKey('item2'), true, 'stores item1 in tree-key')
  t.end()
})
