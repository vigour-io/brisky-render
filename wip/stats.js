const Stats = require('stats-js')
const stats = new Stats()
stats.setMode(0)
document.body.appendChild(stats.domElement)
const indicator = document.createElement('div')
indicator.style.backgroundColor = '#eee'
indicator.style.fontFamily = 'courier'
indicator.style.fontSize = '10px'
indicator.style.padding = '5px'
stats.domElement.appendChild(indicator)
stats.n = n => { indicator.innerHTML = `n = ${n}` }

module.exports = state => {
  const n = 2e3
  var cnt = 0
  const update = () => {
    var i = n
    cnt++
    if (cnt > n) {
      cnt = 0
    }
    stats.n(n)
    var arr = []
    stats.begin()
    // arr[cnt] = 'ha' + cnt
    // arr[cnt + 100] = 'ha' + cnt
    // if (cnt === 1) {
    while (i--) { arr.push(i + cnt) }
    // }
    state.set({ collection: arr })
    stats.end()
    global.requestAnimationFrame(update)
  }
  update()
}
