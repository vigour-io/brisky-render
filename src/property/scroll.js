const easingCache = 3
const easingFraction = 0.95
const easingAccelerator = 1.5
const quadraticEasing = 0.5
const abs = Math.abs

const bounds = (target, val) => {
  if (val < -target._height) {
    // target._easing = false
    return -target._height
  } else if (val > 0) {
    // target._easing = false
    return 0
  } else {
    return val
  }
}

const easeOut = (target, distance, original, event, stamp, easingFraction, setVal) => {
  if (target._easing) {
    // maybe stop when 2 ticks are same value
    target._ly = setVal(target, target._ly + distance * (1 - easingFraction), original, event, stamp)
    if (distance > 0.5 || distance < -0.5) {
      target._isEasing = global.requestAnimationFrame(() => easeOut(target, distance * easingFraction, original, event, stamp, easingFraction, setVal))
    } else {
      target._easing = false
    }
  }
}

const setValX = (target, val, original, event, stamp) => {
  val = bounds(target, val)
  target.style.transform = `translate3d(${val}rem, 0, 0)`
  if (!original) {
    original = target
  }
  if (original._ && original._._scrollListener) {
    original._._scrollListener({ x: val, target: original, scroller: target, state: event.state }, stamp)
  }
  return val
}

const setValY = (target, val, original, event, stamp) => {
  val = bounds(target, val)
  target.style.transform = `translate3d(0, ${val}rem, 0)`
  if (!original) {
    original = target
  }

  if (original._ && original._._scrollListener) {
    original._._scrollListener({ y: val, target: original, scroller: target, state: event.state }, stamp)
  }
  return val
}

const touchstart = ({ target, event }, x, y, ch, sh) => {
  global.cancelAnimationFrame(target._isEasing)

  if (ch >= sh) {
    target._block = true
    target.__init = false
    return true
  }

  target.__init = true
  target._start = y
  target._y = target._ly || 0
  target._easing = false
  target._prev = [ 1, 0, 0, 0 ]
  target._height = sh - ch
  target._block = ch >= sh
  target._sh = sh
  target._ey = y
  target._ex = x
}

const touchmove = (event, x, y, stamp, setVal) => {
  const target = event.target
  if (
    target._block ||
    abs(target._ey - y) <= abs(target._ex - x)
  ) {
    return true
  }
  event.prevent = true
  const original = event.original
  const index = target._prev[0]
  target._prev[0]++
  if (target._prev[0] > easingCache) {
    target._prev[0] = 1
  }
  const val = y - target._start + target._y
  target._prev[index] = val - (target._ly || 0)
  target._ly = setVal(target, val, original, event, stamp)
  target._ey = y
  target._ex = x
}

const touchend = (event, stamp, setVal) => {
  const target = event.target
  target.__init = false
  if (!target._prev) return
  const original = event.original
  var delta = 0
  var i = easingCache
  while (i--) {
    delta += target._prev[i] || 0
  }
  delta = (delta / easingCache) * easingAccelerator
  const sing = delta < 0 ? -1 : 1
  var distance = quadraticEasing * ((delta * delta) * sing)
  if (distance > 750) {
    distance = 750
  }
  target._easing = true
  easeOut(target, distance, original, event, stamp, easingFraction, setVal)
}

const lookupMode = [1.0, 28.0, 500.0]

const wheelX = (event, stamp, sh) => {
  const evt = event.event

  if ('deltaX' in evt) {
    if (abs(evt.deltaX) <= abs(evt.deltaY)) {
      return
    } else {
      event.prevent = true
      evt.preventDefault()
    }
    const mode = lookupMode[evt.deltaMode] || lookupMode[0]
    event.x = evt.deltaX * mode * -1
  } else {
    // is this ok on x?
    event.x = evt.wheelDelta / -3
  }

  const target = event.target
  if (!target.__init) {
    if (!target._ly) {
      target._ly = 0
    }
    if (touchstart(event, event.y, event.x, event.target.parentNode.clientWidth, sh)) {
      return
    }
  }
  clearTimeout(target._timeout)
  target._timeout = setTimeout(() => {
    if (target.offsetParent !== null) {
      target.__init = false
    }
  }, 20)
  target._ly = setValX(target, target._ly + event.x, event.original, event, stamp)
}

const wheelY = (event, stamp, sh) => {
  event.prevent = true
  const evt = event.event
  evt.preventDefault()
  if ('deltaY' in evt) {
    if (abs(evt.deltaX) >= abs(evt.deltaY)) {
      return
    } else {
      event.prevent = true
      evt.preventDefault()
    }
    const mode = lookupMode[evt.deltaMode] || lookupMode[0]
    event.y = evt.deltaY * mode * -1
  } else {
    event.y = evt.wheelDelta / -3
  }
  const target = event.target
  if (!target.__init) {
    if (!target._ly) {
      target._ly = 0
    }
    if (touchstart(event, event.x, event.y, event.target.parentNode.clientHeight, sh)) {
      return
    }
  }
  clearTimeout(target._timeout)
  target._timeout = setTimeout(() => {
    if (target.offsetParent !== null) {
      target.__init = false
    }
  }, 20)
  target._ly = setValY(target, target._ly + event.y, event.original, event, stamp)
}

export default {
  props: {
    scroll: (t, val) => {
      var fn, target, size, direction

      if (!val) return
      if (typeof val === 'function') {
        fn = val
      } else if (typeof val === 'object') {
        if (val.target) target = val.target
        fn = val.onScroll
        direction = val.direction
        size = val.size
      }

      t.set({
        define: {
          hasScrollY: true
        }
      }, false)

      if (fn) {
        t.set({
          define: {
            _scrollListener: fn
          }
        }, false)
      }

      if (!direction) {
        direction = 'y'
      }

      if (!size) {
        size = direction === 'y'
          ? (val) => val.target.scrollHeight
          : (val) => val.target.scrollWidth
      }

      if (!target) {
        target = t => t
      }

      t.set({
        define: {
          setScroll (y, t, stamp) {
            const rt = target(t)
            global.cancelAnimationFrame(rt._isEasing)
            if (!rt._ly) rt._ly = 0
            rt._ly = setValY(rt, bounds(rt, -y) - rt._ly, t, void 0, stamp)
          },
          easeScroll (y, t, stamp) {
            // if its scrolling from the fingers dont do it
            const rt = target(t)
            const event = {
              original: t,
              target: rt,
              state: t._s
            }
            global.cancelAnimationFrame(rt._isEasing)
            rt._easing = true
            if (!rt._ly) rt._ly = 0
            if (direction === 'y') {
              rt._height = size(event) - rt.parentNode.clientHeight
              easeOut(rt, bounds(rt, -y) - rt._ly, t, event, stamp, 0.9, setValY)
            } else {
              rt._height = size(event) - rt.parentNode.clientWidth
              easeOut(rt, bounds(rt, -y) - rt._ly, t, event, stamp, 0.9, setValX)
            }
          }
        },
        on: {
          touchstart: {
            scroll: direction === 'y' ? (val, stamp) => {
              val.target = target(val.target)
              touchstart(val, val.x, val.y, val.target.parentNode.clientHeight, size(val))
            } : (val, stamp) => {
              val.target = target(val.target)
              touchstart(val, val.y, val.x, val.target.parentNode.clientWidth, size(val))
            }
          },
          touchmove: {
            scroll: direction === 'y' ? (val, stamp) => {
              val.original = val.target
              val.target = target(val.target)
              touchmove(val, val.x, val.y, stamp, setValY)
            } : (val, stamp) => {
              val.original = val.target
              val.target = target(val.target)
              touchmove(val, val.y, val.x, stamp, setValX)
            }
          },
          touchend: {
            scroll: direction === 'y' ? (val, stamp) => {
              val.original = val.target
              val.target = target(val.target)
              touchend(val, stamp, setValY)
            } : (val, stamp) => {
              val.original = val.target
              val.target = target(val.target)
              touchend(val, stamp, setValX)
            }
          },
          wheel: {
            scroll: direction === 'y' ? (val, stamp) => {
              val.original = val.target
              val.target = target(val.target)
              wheelY(val, stamp, size(val))
            } : (val, stamp) => {
              val.original = val.target
              val.target = target(val.target)
              wheelX(val, stamp, size(val))
            }
          }
        }
      }, false)
    }
  }
}
