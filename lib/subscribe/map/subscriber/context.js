exports.id = struct => {
  if (struct.storeContextKey) {
    const key = struct.parent().key
    return key ? 'c' + key + '-' + genCid(struct) : 'c' + genCid(struct)
  } else {
    return 'c' + genCid(struct)
  }
}

const genCid = struct => {
  if (struct.context) {
    if (struct.contextLevel === 1) {
      return struct.uid() + '' + genCid(struct.context) // wrong
    } else {
      return struct.uid() + '' + genCid(struct._p)
    }
  } else {
    return struct.uid()
  }
}
