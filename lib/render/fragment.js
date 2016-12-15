export const findParent = node => {
  while (isFragment(node)) {
    node = node[0]
  }
  return node
}

export const isFragment = node => node instanceof Array
