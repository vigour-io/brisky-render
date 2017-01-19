export default (node, dom) => {
  const children = node.childNodes
  let i = children.length
  while (i--) {
    let child = children[0]
    console.log(child.tagName, children.length)
    let tag = child.tagName
    if (tag === 'body' || tag === 'head') {
      console.log('REPLACE', tag)
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
