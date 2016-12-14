module.exports = (state, n) => {
  if (!n) { n = 3 }
  var cnt = 0
  const update = () => {
    var i = n
    cnt++
    if (cnt > n) {
      cnt = 0
    }
    // var d = Date.now()
    var arr = []
    // arr[cnt] = 'ha' + cnt
    // arr[cnt + 100] = 'ha' + cnt
    // if (cnt === 1) {
    while (i--) { arr.push(i + cnt) }
    // }
    state.set({ collection: arr })
    // console.log(`n = ${n}`, Date.now() - d, 'ms')
    // global.requestAnimationFrame(update)
  }
  update()
}
