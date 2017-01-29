export default (node, dom, element) => {
  element.emit('resolve', true)
  const children = node.childNodes
  let i = children.length
  while (i--) {
    let child = children[0]
    let tag = child.tagName
    // let replaced
    if (tag === 'BODY' || tag === 'HEAD') { // this can go (just use resolve)
      let j = dom.childNodes.length
      while (j--) {
        if (dom.childNodes[j].tagName === tag) {
          // replaced = true
          dom.removeChild(dom.childNodes[j])
          // merge(child, dom.childNodes[j])
          break
        }
      }
    }
    // if (!replaced)
    if (!child.getAttribute('data-hash')) {
      dom.appendChild(child)
    }
  }
  setTimeout(() => { element.emit('resolve', false) })
  return dom
}
