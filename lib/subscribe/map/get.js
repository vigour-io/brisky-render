const get$ = t => t.$ || t.inherits && get$(t.inherits)
const getType = t => t.subscriptionType || t.inherits && getType(t.inherits)

exports.get$ = get$
exports.getType = getType
