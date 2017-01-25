import attach from './attach'
import bstamp from 'brisky-stamp'
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
        if (!stamp) stamp = bstamp.create()
        let data = { target: t }
        restore(data)
        elem.emit(key, attach(e, data), stamp)
        if (data.prevent) {
          break
        }
      }
    }
    if (stamp) bstamp.close()
  } while ((t = t.parentNode))
}
