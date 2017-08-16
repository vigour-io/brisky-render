import { touchMove } from './events'

const ScrollManager = function (target) {
  const settings = target._.scroll
  for (let i in settings) {
    this[i] = settings[i]
  }
  this.currentTarget = target
  this.state = target._s
  target.addEventListener('touchmove', touchMove, false)
  target.scrollManager = this
}

const proto = ScrollManager.prototype
proto.position = 0
proto.direction = 'y'
proto.timeStamp = 0
proto.getTarget = ({ currentTarget }) => currentTarget
proto.getOffsetSize = ({ target, direction }) => direction === 'y'
  ? target.parentNode.clientHeight
  : target.parentNode.clientWidth
proto.getScrollSize = ({ target, direction }) => direction === 'y'
  ? target.scrollHeight
  : target.scrollWidth

export default ScrollManager
