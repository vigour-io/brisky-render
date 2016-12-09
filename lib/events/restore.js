module.exports = (data) => {
  var target = data.target
  var state = target._s
  if (state) {
    // apply and store context
    const resolved = state.applyContext(target._sc)
    if (resolved) {
      target._s = state = resolved
      target._sc = state.storeContext()
    } else if (resolved === null) {
      target._s = null
      delete target._sc
      state = null
    }
    data.state = state
  }
}
