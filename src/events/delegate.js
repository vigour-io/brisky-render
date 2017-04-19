import attach from './attach'
import { create, close } from 'stamp'
import restore from './restore'

const emitter = (t, key) => t.emitters && t.emitters[key] ||
  t.inherits && emitter(t.inherits, key)

export default (key, e) => {
  var t = e.target
  var stamp
  do {
    let elem = t._
    if (elem) {
      let listener = emitter(elem, key)
      if (listener) {
        if (!stamp) stamp = create()
        let data = { target: t }
        restore(data)
        elem.emit(key, attach(e, data), stamp)
        if (data.prevent) {
          break
        }
      }
    }
  } while ((t = t.parentNode))
  if (stamp) close()
}
