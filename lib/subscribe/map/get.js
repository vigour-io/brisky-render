const get$ = t => t.$ !== void 0 ? t.$ : t.inherits && get$(t.inherits)
const getType = t => t.subscriptionType || t.inherits && getType(t.inherits)

exports.get$ = get$
exports.getType = getType
