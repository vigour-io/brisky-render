exports.define = {
  findIndex (parent) {
    if (parent) {
      if (!parent.$any) {
        const key = this.key
        if (key !== void 0 && key !== null) {
          const keys = parent.keys()
          if (keys) {
            const len = keys.length
            if (len > 1) {
              for (let i = 0; i < len; i++) {
                if (keys[i] === key) {
                  if (parent.tag === 'fragment') {
                    return (parent.findIndex(parent.parent()) || 1) + ((i + 1) / (len + 1)).toFixed(len + ''.length)
                  } else {
                    return i + 1
                  }
                }
              }
            }
          }
        }
      }
      if (parent.tag === 'fragment') {
        return parent.findIndex(parent.parent())
      }
    }
  }
}
