exports.appendUnit = (val, unit) => typeof val === 'number' && !isNaN(val)
  ? val + unit
  : val
