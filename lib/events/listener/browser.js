const ua = require('vigour-ua/navigator') // again scope it differently this is bit dirty

// just use hasTouch
const touch = typeof window !== 'undefined' && ((('ontouchstart' in global) ||
  global.DocumentTouch &&
  document instanceof global.DocumentTouch) ||
  navigator.msMaxTouchPoints)

// super unreliable check for chrome emulator for development (on mac only)
// const isChromeEmulator = touch &&
//   navigator.vendor === 'Google Inc.' &&
//   navigator.platform === 'MacIntel'

if (ua.platform === 'ios' && touch) {
  document.documentElement.style.cursor = 'pointer' // ios test...
  document.body.style.cursor = 'pointer'
}

module.exports = function () {
  const l = arguments.length
  const a = []
  for (let i = 0; i < l; i++) {
    let key = arguments[i]
    let listener = arguments[++i]
    console.log(key)
    addEventListener(key, listener, key === 'focus' || key === 'scroll' || key === 'blur')
    a.push(key, listener)
  }
  return () => {
    for (let i = 0; i < l; i++) { // remove listeners test!
      document.removeEventListener(a[i], a[++i])
    }
  }
}

const addEventListener = function addEventListener (key, listener, capture) {
  document.addEventListener(key, listener, capture)
}
// : function addEventListener (key, listener, capture) { // chrome emulator tests
//   const touchEvent = key.indexOf('mouse') === -1
//   if (touchEvent) { document.addEventListener(key, listener, capture) }
// }
