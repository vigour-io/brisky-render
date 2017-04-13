const easingCache = 3
const easingFraction = 0.95
const easingDistance = 5

const bounds = () => {

}

const setVal = (target, val) => {
  target.style.transform = `translate3d(0, ${val}rem, 0)`
  if (target._ && target._._scrollListener) {
    target._._scrollListener(target, val)
  }
}

const touchstart = ({ target, y }) => {
  target._start = y
  target._y = target._ly || 0
  target._easing = false
  target._prev = [ 1, 0, 0, 0 ]
}

const easeOut = (target, distance) => {
  if (target._easing) {
    setVal(target, target._ly + distance * 0.1)
    target._ly = target._ly + distance * 0.1
    if (distance > 10 || distance < -10) {
      global.requestAnimationFrame(() => easeOut(target, distance * easingFraction))
    } else {
      target._easing = false
    }
  }
}

const touchend = ({ target }) => {
  var delta = 0
  var i = easingCache
  while (i--) {
    delta += target._prev[i] || 0
  }
  delta = delta / easingCache
  const distance = delta * easingDistance
  target._easing = true
  easeOut(target, distance)
}

const touchmove = ({ target, event, y }) => {
  const index = target._prev[0]
  target._prev[0]++
  if (target._prev[0] > easingCache) {
    target._prev[0] = 1
  }
  const val = y - target._start + target._y
  target._prev[index] = val - (target._ly || 0)
  target._ly = val
  setVal(target, val)
}

export default {
  props: {
    scroll: (t, val) => {
      if (typeof val === 'function') {
        t.set({
          define: {
            _scrollListener: val
          }
        })
      }
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
