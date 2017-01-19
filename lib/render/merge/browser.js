export default (node, dom) => {
  const children = node.childNodes
  let i = children.length
  while (i--) {
    let child = children[0]
    let tag = child.tagName
    // let replaced
    if (tag === 'BODY' || tag === 'HEAD') {
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
    dom.appendChild(child)
  }
  return dom
}
