
/* if the bridge has not already been set up => setup the bridge */
/* else use the previously set up bridge */
if (!global.ployNativeBridgeJs) {
  var jsBridge = global.jsBridge
  var postMessage

  if (~navigator.userAgent.indexOf('ploy-native')) {
    if (jsBridge) {
      postMessage = msg => jsBridge.postMessage(JSON.stringify(msg))
    } else {
      jsBridge = global.webkit && global.webkit.messageHandlers.jsBridge
      postMessage = jsBridge && jsBridge.postMessage.bind(jsBridge)
    }
  } else if (jsBridge) {
    postMessage = jsBridge.postMessage.bind(jsBridge)
  }

  if (jsBridge) {
    const batch = []
    const store = {}
    let ready

    exports.subscribe = function subscribe (id, listener) {
      if (ready) {
        if (!(id in store)) {
          postMessage({
            type: 'app',
            method: 'subscribe',
            body: [ id ]
          })
          store[id] = [listener]
        } else if (store[id].indexOf(listener) === -1) {
          store[id].push(listener)
        }
      } else {
        batch.push(subscribe, id, listener)
      }
    }

    exports.unsubscribe = function unsubscribe (id, listener) {
      if (ready) {
        if (id in store) {
          const listeners = store[id]
          const length = listeners.length
          for (let i = length - 1; i >= 0; i--) {
            if (listeners[i] === listener) {
              listeners.splice(i, 1)
              if (length === 1) {
                postMessage({
                  type: 'app',
                  method: 'unsubscribe',
                  body: [ id ]
                })
                delete store[id]
              }
              break
            }
          }
        }
      } else {
        batch.push(unsubscribe, id, listener)
      }
    }

    exports.post = function post (obj) {
      if (ready) {
        postMessage(obj)
      } else {
        batch.push(postMessage, obj, void 0)
      }
    }

    exports.init = function init (body) {
      postMessage({
        type: 'app',
        method: 'subscribe',
        body: [ 'app.init.ready' ]
      })

      postMessage({
        type: 'app',
        method: 'init',
        body
      })
    }

    exports.store = store

    global.handleNative = function handleNative (msg) {
      if (msg.id === 'app.init.ready') {
        ready = true
        for (let i = 0, l = batch.length; i < l; i += 3) {
          batch[i](batch[i + 1], batch[i + 2])
        }
      } else {
        const listeners = store[msg.id]
        if (listeners) {
          for (var i = listeners.length - 1; i >= 0; i--) {
            listeners[i](msg)
          }
        }
      }
    }
  } else {
    // stubs
    exports.subscribe = function () {}
    exports.unsubscribe = function () {}
    exports.post = function () {}
    exports.init = function () {}
  }
  global.ployNativeBridgeJs = exports
} else {
  module.exports = global.ployNativeBridgeJs
}

const bridge = require('./bridge')
const raf = global.requestAnimationFrame
bridge.init({
  version: '1.0.0',
  namespaces: ['urn:x-cast:com.google.cast.sample.helloworld']
})
raf(() => {
  console.log('go bridge!')
  bridge.post({
    type: 'app',
    method: 'hideSplash',
    body: {}
  })
})
