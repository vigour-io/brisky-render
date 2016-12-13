(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict'
/* if the bridge has not already been set up => setup the bridge */
/* else use the previously set up bridge */
if (!global.ployNativeBridgeJs) {
  var jsBridge = global.jsBridge
  var postMessage

  if (~navigator.userAgent.indexOf('ploy-native')) {
    if (jsBridge) {
      postMessage = function (msg) { return jsBridge.postMessage(JSON.stringify(msg)); }
    } else {
      jsBridge = global.webkit && global.webkit.messageHandlers.jsBridge
      postMessage = jsBridge && jsBridge.postMessage.bind(jsBridge)
    }
  } else if (jsBridge) {
    postMessage = jsBridge.postMessage.bind(jsBridge)
  }

  if (jsBridge) {
    var batch = []
    var store = {}
    var ready

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
          var listeners = store[id]
          var length = listeners.length
          for (var i = length - 1; i >= 0; i--) {
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
        body: body
      })
    }

    exports.store = store

    global.handleNative = function handleNative (msg) {
      if (msg.id === 'app.init.ready') {
        ready = true
        for (var i$1 = 0, l = batch.length; i$1 < l; i$1 += 3) {
          batch[i$1](batch[i$1 + 1], batch[i$1 + 2])
        }
      } else {
        var listeners = store[msg.id]
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

var bridge = require('./bridge')
var raf = global.requestAnimationFrame
bridge.init({
  version: '1.0.0',
  namespaces: ['urn:x-cast:com.google.cast.sample.helloworld']
})
raf(function () {
  console.log('go bridge!')
  bridge.post({
    type: 'app',
    method: 'hideSplash',
    body: {}
  })
})


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./bridge":1}]},{},[1]);
