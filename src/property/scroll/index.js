import { scrollTo, touchStart, touchEnd, wheel } from './events'
import ScrollManager from './manager'

export default {
  props: {
    scroll (t, scroll) {
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
