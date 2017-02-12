const findParent = node => {
  while (isFragment(node)) {
    node = node[0]
  }
  return node
}

const isFragment = node => node instanceof Array

export { findParent, isFragment }
