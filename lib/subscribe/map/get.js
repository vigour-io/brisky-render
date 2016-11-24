const get$ = t => t.$ !== void 0 ? t.$ : t.inherits && get$(t.inherits)

const getType = t => t.subscriptionType || t.inherits && getType(t.inherits)

const isGroup = t => t.isGroup !== void 0
  ? t.isGroup
  : t.inherits && isGroup(t.inherits)

exports.get$ = get$
exports.getType = getType
exports.isGroup = isGroup
