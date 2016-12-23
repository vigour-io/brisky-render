import instance from './instance'

export default (styletron = instance) => {
  styletron.cache = {}
  styletron.uniqueCount = 0
  var i = styletron.mainSheet ? styletron.mainSheet.sheet.rules.length : 0
  while (i--) {
    styletron.mainSheet.sheet.deleteRule(i)
  }
}
