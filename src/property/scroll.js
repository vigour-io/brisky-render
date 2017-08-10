const deltasLastIndex = 2
const transform = 'transform'
var isScrolling

const defaults = {
  direction: 'y',
  getOffsetSize: ({ currentTarget }) => currentTarget.parentNode.clientHeight,
  getScrollSize: ({ currentTarget }) => currentTarget.scrollHeight,
  getTarget: ({ currentTarget }) => currentTarget
}

const scrollInit = currentTarget => {
  if (!('scrollManager' in currentTarget)) {
    const settings = currentTarget._.scrollSettings
    const scrollManager = {
      getOffsetSize: settings.getOffsetSize || defaults.getOffsetSize,
      getScrollSize: settings.getScrollSize || defaults.getScrollSize,
      getTarget: settings.getTarget || defaults.getTarget,
      direction: settings.direction || defaults.direction,
      state: currentTarget._s,
      currentTarget,
    }
    if ('onScroll' in settings) scrollManager.onScroll = settings.onScroll
    currentTarget.addEventListener('touchmove', onTouchMove, false)
    currentTarget.scrollManager = scrollManager
  }
  return currentTarget.scrollManager
}

const scrollStart = scroll => {
  scroll.target = scroll.getTarget(scroll)
  scroll.deltaSize = scroll.getOffsetSize(scroll) - scroll.getScrollSize(scroll)

  if (scroll.deltaSize) {
    scroll.deltasIndex = 0
    scroll.deltas = [0,0,0]
    scroll.position = scroll.position || 0
    scroll.style = scroll.target.style
    return true
  }
}

const scrollMove = (scroll, position) => {
  var withinBounds
  if (position > 0) {
    position = 0
  } else if (position < scroll.deltaSize) {
    position = scroll.deltaSize
  } else {
    withinBounds = true
  }

  scroll.position = position
  scroll.style[transform] = scroll.direction === 'y'
    ? `translate3d(0, ${position}px, 0)`
    : `translate3d(${position}px, 0, 0)`

  return withinBounds
}

const scrollEnd = scroll => {
  var delta = 0
  var i = deltasLastIndex
  while (i) { delta += scroll.deltas[i--] }
  delta /= deltasLastIndex + 1
  isScrolling = false
  ;(function ease () {
    delta *= 0.95
    if (delta > 0.5 || delta < -0.5) {
      scroll.isScrolling = scrollMove(scroll, scroll.position + delta) &&
        global.requestAnimationFrame(ease)
    } else {
      scroll.isScrolling = false
    }
    if ('onScroll' in scroll) scroll.onScroll(scroll)
  })()
}

const onTouchStart = ({ target, event }) => {
  const scroll = scrollInit(target, event)
  if (scroll.isScrolling) {
    global.cancelAnimationFrame(scroll.isScrolling)
    scroll.isScrolling = false
  }
  if (!isScrolling) {
    const e = event.changedTouches[0]
    if (scroll.direction === 'y') {
      scroll.clientPos = e.clientY
      scroll.oppositePos = e.clientX
    } else {
      scroll.clientPos = e.clientX
      scroll.oppositePos = e.clientY
    }

    scroll.canScroll = scrollStart(scroll)
  }
}

const onTouchMove = e => {
  const scroll = e.currentTarget.scrollManager
  if (scroll.canScroll) {
    const clientPos = scroll.direction === 'y'
      ? e.changedTouches[0].clientY
      : e.changedTouches[0].clientX
    const delta = clientPos - scroll.clientPos

    if (!scroll.isScrolling) {
      const oppositePos = scroll.direction === 'y'
      ? e.changedTouches[0].clientX
      : e.changedTouches[0].clientY
      if (Math.abs(delta) > Math.abs(oppositePos - scroll.oppositePos)) {
        scroll.isScrolling = true
        isScrolling = true
      } else {
        scroll.canScroll = false
        return
      }
    }

    const deltasIndex = scroll.deltasIndex
    scroll.deltasIndex = deltasIndex === deltasLastIndex ? 0 : deltasIndex + 1
    scroll.deltas[deltasIndex] = scrollMove(scroll, scroll.position + delta) ? delta : 0
    scroll.clientPos = clientPos
    scroll.timeStamp = e.timeStamp

    if ('onScroll' in scroll) scroll.onScroll(scroll)
  }
}

const onTouchEnd = ({ target }) => {
  const scroll = target.scrollManager
  if (scroll.isScrolling) {
    scrollEnd(scroll)
  }
}

const scrollTo = (node, position, animate) => {
  const scroll = scrollInit(node)
  if (animate) {

  } else {
    if (scrollStart(scroll)) {
      scrollMove(scroll, position)
      scrollEnd(scroll)
    }
  }
}

export default {
  props: {
    scroll (t, scrollSettings) {
      t.set({
        define: {
          scrollTo,
          scrollSettings
        },
        on: {
          touchstart: { scroll: onTouchStart },
          touchend: { scroll: onTouchEnd }
        }
      }, false)
    }
  }
}
