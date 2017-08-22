import { scrollTo, touchStart, touchEnd, wheel } from './events'
import ScrollManager from './manager'

export default {
  props: {
    scroll (t, scroll) {
      if (typeof scroll === 'object') {
        if ('onScroll' in scroll) {
          scroll.onScroll = [scroll.onScroll]
        }
        if ('onScrollEnd' in scroll) {
          scroll.onScrollEnd = [scroll.onScrollEnd]
        }
      }
      t.set({
        define: {
          scroll,
          scrollTo
        },
        on: {
          touchstart: { scroll: touchStart },
          touchend: { scroll: touchEnd },
          wheel: { scroll: wheel }
        }
      }, false)
    }
  }
}
