const deltasLastIndex = 2
const transform = 'transform'
const abs = Math.abs

const defaults = {
  direction: 'y',
  getOffsetSize: ({ target }) => target.parentNode.clientHeight,
  getScrollSize: ({ target }) => target.scrollHeight,
  getTarget: ({ currentTarget }) => currentTarget
}

const getScrollManager = currentTarget => {
  var scroll
  if (!('scrollManager' in currentTarget)) {
    const settings = currentTarget._.scrollSettings
    scroll = {
      getOffsetSize: settings.getOffsetSize || defaults.getOffsetSize,
      getScrollSize: settings.getScrollSize || defaults.getScrollSize,
      getTarget: settings.getTarget || defaults.getTarget,
      direction: settings.direction || defaults.direction,
      state: currentTarget._s,
      timeStamp: 0,
      currentTarget,
    }
    if ('onScroll' in settings) {
      scroll.onScroll = settings.onScroll
    }
    currentTarget.addEventListener('touchmove', onTouchMove, false)
    currentTarget.scrollManager = scroll
  } else {
    scroll = currentTarget.scrollManager
    if (scroll.isScrolling) {
      global.cancelAnimationFrame(scroll.isScrolling)
      scroll.isScrolling = false
    }
  }
  return scroll
}

const updateScrollManager = scroll => {
  scroll.target = scroll.getTarget(scroll)
  scroll.scrollDelta = scroll.getOffsetSize(scroll) - scroll.getScrollSize(scroll)
  scroll.style = scroll.target.style
  scroll.isScrolling = false
}

const scrollMove = (scroll, position) => {
  var withinBounds
  if (position > 0) {
    position = 0
  } else if (position < scroll.scrollDelta) {
    position = scroll.scrollDelta
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
  const scroll = getScrollManager(target)
  const e = event.changedTouches[0]
  if (scroll.direction === 'y') {
    scroll.clientPos = e.clientY
    scroll.oppositePos = e.clientX
  } else {
    scroll.clientPos = e.clientX
    scroll.oppositePos = e.clientY
  }
  updateScrollManager(scroll)
}

const onMoveEvent = (e, scroll, delta) => {
  if (scroll.scrollDelta) {
    if (!scroll.isScrolling) {
      let oppositeDelta
      if ('changedTouches' in e) {
        oppositeDelta = scroll.direction === 'y'
        ? e.changedTouches[0].clientX - scroll.oppositePos
        : e.changedTouches[0].clientY - scroll.oppositePos
      } else {
        oppositeDelta = scroll.direction === 'y'
        ? e.deltaX
        : e.deltaY
      }
      if (abs(delta) > abs(oppositeDelta)) {
        scroll.position = scroll.position || 0
        scroll.deltasIndex = 0
        scroll.deltas = [0,0,0]
        scroll.isScrolling = true
      } else {
        scroll.scrollDelta = false
        return
      }
    }

    const deltasIndex = scroll.deltasIndex
    scroll.deltasIndex = deltasIndex === deltasLastIndex ? 0 : deltasIndex + 1
    scroll.deltas[deltasIndex] = scrollMove(scroll, scroll.position + delta) ? delta : 0
    scroll.timeStamp = e.timeStamp

    if ('onScroll' in scroll) scroll.onScroll(scroll)
  }
}

const onTouchMove = e => {
  const scroll = e.currentTarget.scrollManager
  if (scroll.scrollDelta) {
    const clientPos = scroll.direction === 'y'
      ? e.changedTouches[0].clientY
      : e.changedTouches[0].clientX
    onMoveEvent(e, scroll, clientPos - scroll.clientPos)
    scroll.clientPos = clientPos
  }
}

const onTouchEnd = ({ target }) => {
  const scroll = target.scrollManager
  if (scroll.isScrolling) {
    scrollEnd(scroll)
  }
}

const onWheel = ({ target, event }) => {
  const scroll = getScrollManager(target)
  if (scroll.timeStamp < event.timeStamp - 100) {
    updateScrollManager(scroll)
    scroll.timeStamp = event.timeStamp
  }
  onMoveEvent(event, scroll, scroll.direction === 'y' ? -event.deltaY : -event.deltaX)
  event.preventDefault()
}

const scrollTo = (node, position, animate) => {
  const scroll = getScrollManager(node)
  updateScrollManager(scroll)
  scrollMove(scroll, position)
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
          touchend: { scroll: onTouchEnd },
          wheel: { scroll: onWheel }
        }
      }, false)
    }
  }
}
