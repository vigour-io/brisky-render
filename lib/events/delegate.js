const attach = require('./attach')
const bstamp = require('brisky-stamp')
// const restore = require('./restore')

const emitter = (t, key) => t.emitters && t.emitters[key] ||
  t.inherits && emitter(t.inherits, key)

module.exports = (key, e) => {
  var t = e.target
  var stamp
  do {
    let elem = t._
    if (elem) {
      let listener = emitter(elem, key)
      if (listener) {
        if (!stamp) {
          stamp = bstamp.create(key)
        }
        let data = { t }
        // restore(data) -- context restore
        elem.emit(key, attach(e, data), stamp)
        if (data.prevent) {
          break
        }
      }
    }
    if (stamp) {
      bstamp.close(stamp)
    }
  } while ((t = t.parentNode))
}
