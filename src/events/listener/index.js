import mock from './mock'

function Event (type) {
  this.type = type
}

Event.prototype.preventDefault = function () {
  console.log('WARN - prevent default - not implemented in node.js yet!')
}

Object.defineProperty(global.Element.prototype, 'dispatchEvent', {
  configurable: true,
  value: function (event) {
    exec(this, event)
  }
})

function exec (node, event) {
  var store = mock[event.type]
  event.target = node
  if (store) {
    for (let i = 0; i < store.length; i++) {
      store[i].call(node, event)
    }
  }
}

global.Event = Event

global.document.addEventListener = function (key, fn) {
  var store = mock[key]
  if (!store) {
    store = mock[key] = []
  }
  store.push(fn)
}

global.document.removeEventListener = function (key, fn) {
  const store = mock[key]
  if (store) {
    for (let i = 0, len = store.length; i < len; i++) {
      if (store[i] === fn) {
        store.splice(i, 1)
        break
      }
    }
  }
}
import browser from './browser'
export default browser
