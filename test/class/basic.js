const { create: s } = require('brisky-struct')
const test = require('tape')
const { render } = require('../../')
const isNode = typeof window === 'undefined'

test('basic - static class name', t => {
  var elem
  t.plan(5)

  elem = render({
    class: 'simple-class'
  })

  t.equals(elem.className, 'simple-class', 'simple value')

  elem = render({
    class: {
      'simple-class': 'simple-class'
    }
  })

  t.equals(elem.className, 'simple-class', 'single field: true')

  elem = render({
    class: {
      'simple-class': false
    }
  })

  t.same(elem.className, isNode ? void 0 : '', 'single field: false')

  elem = render({
    class: {
      simpleString: 'simple-string'
    }
  })

  t.equals(elem.className, 'simple-string', 'single string')

  elem = render({
    class: {
      val: 'simple-value',
      'simple-class': 'simple-class',
      'not-this': false,
      simpleString: 'simple-string'
    }
  })

  t.equals(elem.className, 'simple-value simple-class simple-string', 'mixed')
})

test('basic - state driven class name', t => {
  var elem
  t.plan(4)

  elem = render({
    class: {
      $: 'simpleClass'
    }
  }, {
    simpleClass: 'simple-class'
  })

  t.equals(elem.className, 'simple-class', 'class value from state')

  elem = render({
    // note: needs to be nested => state does not support top subs completely
    $: 'someData',
    class: {
      field: {
        $: 'simpleClass'
      }
    }
  }, {
    someData: {
      simpleClass: 'simple-class'
    }
  })

  t.equals(elem.className, 'simple-class', 'class field from state')

  elem = render({
    // note: needs to be nested => state does not support top subs completely
    $: 'someData',
    class: {
      val: 'simple-value',
      one: {
        $: 'simpleClass'
      },
      field: 'simple-field',
      another: {
        $: 'anotherClass'
      }
    }
  }, {
    someData: {
      simpleClass: 'simple-class',
      anotherClass: 'another-class'
    }
  })

  t.equals(elem.className, 'simple-value simple-field another-class simple-class', 'mixed static with multiple state')

  elem = render({
    $: 'simpleClass',
    class: { $: true }
  }, {
    simpleClass: 'simple-class'
  })

  t.equals(elem.className, 'simple-class', 'subscribe with true')
})

test('basic - keys as class name', t => {
  var elem = render({
    key: 'elem',
    class: {
      $: 'simpleClass'
    }
  }, {
    simpleClass: 'simple-class'
  })
  t.equals(elem.className, 'simple-class', 'class does not include key by default')
  elem = render({
    key: 'elem',
    class: 'elem'
  })
  t.equals(elem.className, 'elem', 'class does include key when class: true')
  t.end()
})

test('basic - toggle class name', t => {
  const state = s({ thing: 'hello' })
  const elem = render({
    key: 'elem',
    class: { hello: { $: 'thing' } }
  }, state)
  t.equals(elem.className, 'hello', 'initial class')
  // state.set({ thing: false })
  state.thing.set(false)
  t.equals(elem.className, isNode ? void 0 : '', 'set thing to false')
  t.end()
})

test('basic - use key and nested state', t => {
  const state = s({ thing: 'elem hello' })
  const elem = render({
    class: { hello: { $: 'thing' } }
  }, state)
  t.equals(elem.className, 'elem hello', 'initial class')
  state.thing.set(false)
  t.ok(elem.className === void 0 || elem.className === '', 'set thing to false')
  t.end()
})

test('basic - nested state edge case', t => {
  const state = s({
    clients: {
      client: {
        menu: false
      }
    },
    client: [ '@', 'root', 'clients', 'client' ]
  })
  const app = render({
    elem: {
      text: 'ಠ_ರೃ',
      class: {
        val: 'active',
        menu: {
          $: 'client.menu',
          $transform: (val, state) => val === true
            ? 'on'
            : (val === false ? '' : 'off')
        }
      }
    }
  }, state)

  state.clients.client.menu.set(true)

  t.equals(app.childNodes[0].className, 'active on', 'set menu to "true"')
  state.clients.client.menu.set('bla')

  t.equals(app.childNodes[0].className, 'active off', 'set menu to "bla"')
  state.clients.client.menu.set(false)

  t.equals(app.childNodes[0].className, 'active ', 'set menu to "false"')

  t.end()
})
