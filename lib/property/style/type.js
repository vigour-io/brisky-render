import parent from '../../render/dom/parent'

const injectable = {}

export default injectable

injectable.properties = { name: true }
injectable.type = 'property'
injectable.render = {
  static (target, pnode) {
    pnode.style[target.name || target.key] = target.compute()
  },
  state (t, s, type, subs, tree, id, pid) {
    if (type !== 'remove') {
      const pnode = parent(tree, pid)
      pnode.style[t.name || (t.key !== 'default' ? t.key : s.key)] = s
      ? t.compute(s, s)
      : t.compute()
    }
  }
}
