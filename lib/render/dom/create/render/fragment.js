import { element } from '../../../static'

export default (target, pnode, id, tree) => {
  const arr = [ pnode ]
  element(target, arr)
  tree._[id] = arr
  return arr
}
