'use strict'
const isNumber = require('vigour-util/is/numberlike')
exports.appendUnit = (val, unit) => isNumber(val) ? val + unit : val
