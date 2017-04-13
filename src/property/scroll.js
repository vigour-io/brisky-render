// import attach from '../events/attach'

const easingCache = 3
const easingFraction = 0.95
const easingDistance = 5

const bounds = (target, val) => {
  if (val < -target._height) {
    target._easing = false
    return -target._height
  } else if (val > 0) {
    target._easing = false
    return 0
  } else {
    return val
  }
}

const setVal = (target, val, original, event, stamp) => {
  val = bounds(target, val)
  target.style.transform = `translate3d(0, ${val}rem, 0)`
  if (!original) {
    original = target
  } else {
    event.target = original
  }
  if (original._ && original._._scrollListener) {
    event.y = val
    original._._scrollListener(event, stamp)
  }
  return val
}

const touchstart = ({ target, y }) => {
  target._start = y
  target._y = target._ly || 0
  target._easing = false
  target._prev = [ 1, 0, 0, 0 ]
  target._height = target.scrollHeight - target.parentNode.clientHeight
  target._block = target.parentNode.clientHeight >= target.scrollHeight
}

const easeOut = (target, distance, original, event, stamp) => {
  if (target._easing) {
    target._ly = setVal(target, target._ly + distance * 0.1, original, event, stamp)
    if (distance > 10 || distance < -10) {
      global.requestAnimationFrame(() => easeOut(target, distance * easingFraction, original, event, stamp))
    } else {
      target._easing = false
    }
  }
}

const touchend = (event, stamp) => {
  const target = event.target
  const original = event.original
  var delta = 0
  var i = easingCache
  while (i--) {
    delta += target._prev[i] || 0
  }
  delta = delta / easingCache
  const sing = delta < 0 ? -1 : 1
  var distance = 0.25 * ((delta * delta) * sing)
  if (distance > 750) {
    distance = 750
  }
  target._easing = true
  easeOut(target, distance, original, event, stamp)
}

const touchmove = (event, stamp) => {
  const target = event.target
  if (target._block) return true
  const original = event.original
  const y = event.y
  const index = target._prev[0]
  target._prev[0]++
  if (target._prev[0] > easingCache) {
    target._prev[0] = 1
  }
  const val = y - target._start + target._y
  target._prev[index] = val - (target._ly || 0)
  target._ly = setVal(target, val, original, event, stamp)
}

export default {
  props: {
    scroll: (t, val) => {
      var fn, target
      if (typeof val === 'function') {
        fn = val
      } else if (typeof val === 'object') {
        if (val.onScroll) {
          fn = val.onScroll
        }
        if (val.target) {
          target = val.target
        }
      }
      if (fn) {
        t.set({
          define: {
            _scrollListener: fn
          }
        })
      }
      if (target) {
        t.set({
          on: {
            touchstart: {
              scroll: (val, stamp) => {
                val.target = target(val.target)
                touchstart(val, stamp)
              }
            },
            touchmove: {
              scroll: (val, stamp) => {
                val.original = val.target
                val.target = target(val.target)
                touchmove(val, stamp)
              }
            },
            touchend: {
              scroll: (val, stamp) => {
                val.original = val.target
                val.target = target(val.target)
                touchend(val, stamp)
              }
            }
          }
        })
      } else {
        t.set({
          on: {
            touchmove: { scroll: touchmove },
            touchstart: { scroll: touchstart },
            touchend: { scroll: touchend }
          }
        })
      }
    }
  }
}

/*
          // mousedown: {
          //   scroll: val => {
          //     const target = val.target
          //     touchstart(val)
          //     target._mm = e => {
          //       touchmove(attach(e, val))
          //     }
          //     target.addEventListener('mousemove', target._mm, false)
          //   }
          // },
          // mouseup: {
          //   scroll: val => {
          //     touchend(val)
          //     val.target.removeEventListener('mousemove', val.target._mm)
          //   }
          // }
*/
