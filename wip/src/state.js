import hub from 'hub.js'

const x = global.state = hub({
  // id: 'GURRR',
  url: 'ws://localhost:3031'
})

export default x
