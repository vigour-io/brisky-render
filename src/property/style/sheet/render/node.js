export default node => {
  if (node.tagName.toLowerCase() === 'html') { // tmp fix for node.js
    let head
    const children = node.childNodes
    for (let i = 0, len = children.length; i < len; i++) {
      if (children[i].tagName && children[i].tagName.toLowerCase() === 'head') {
        head = children[i]
        break
      }
    }
    if (!head) {
      head = document.createElement('head')
      node.appendChild(head)
    }
    return head
  }
  return node
}
