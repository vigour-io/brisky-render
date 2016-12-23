import Styletron from 'styletron'

var styletron
if (typeof window !== 'undefined') {
  const hydrate = document.getElementsByClassName('_styletron_hydrate_')
  styletron = new Styletron(
    hydrate[0]
    ? hydrate
    : [ document.head.appendChild(document.createElement('style')) ]
  )
} else {
  styletron = global.styletron = new Styletron()
}

export default styletron
