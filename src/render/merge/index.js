export default (node, dom, element) => {
  const children = node.childNodes
  let i = children.length
  while (i--) {
    let child = children[0]
    let tag = child.tagName
    if (tag === 'body' || tag === 'head') { // this can all go
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
    node.removeChild(child)
    dom.appendChild(child)
  }
  return dom
}
