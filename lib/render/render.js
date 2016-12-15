import render from './state'

export default (state, type, subs, tree) => {
  const _ = subs._
  if (_) {
    if (type !== 'update') {
      const traveler = _.tList
      if (traveler) {
        for (let i = 0, len = traveler.length; i < len; i += 4) {
          render(traveler[i + 3], state, type, subs, tree, traveler[i], traveler[i + 1], traveler[i + 2])
        }
      }
    } else if (_.sList) {
      const specific = _.sList
      for (let i = 0, len = specific.length; i < len; i += 4) {
        render(specific[i + 3], state, type, subs, tree, specific[i], specific[i + 1], specific[i + 2])
      }
    }
  }
}
