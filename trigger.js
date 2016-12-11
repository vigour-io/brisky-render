module.exports = (node, type) => {
  node.dispatchEvent(typeof type === 'object'
    ? type
    : new global.Event(type, { bubbles: true })
  )
}
