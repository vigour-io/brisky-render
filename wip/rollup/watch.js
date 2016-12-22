const config = require('./config')
const watch = require('rollup-watch')
const rollup = require('rollup')
let timer

say(`Hi \x1b[36m${process.env.USER}\x1b[0m, let's make some magic!✨\n🙂`)

config.forEach(opts => {
  watch(rollup, opts).on('event', event => {
    // say(
    //   event.code === 'STARTING' ? '😄'
    //   : event.code === 'BUILD_START' ? '😆'
    //     : `😌 < \x1b[36m${event.duration}\x1b[0m ms!`
    // )
    console.log(event)
    clearTimeout(timer)
    timer = setTimeout(() => say('😴'), 3000)
  })
})

function say (txt) {
  process.stdout.clearLine()
  process.stdout.write(txt)
  process.stdout.cursorTo(0)
}
