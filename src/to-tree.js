const node = (name, size) => ({
  size,
  name,
  children: [],
  _childrenMap: new Map()
})

const findChild = (n, name) => n._childrenMap.get(name)

const addChild = (n, name) => {
  const c = node(name)
  n.children.push(c)
  n._childrenMap.set(name, c)

  return c
}

const insert = (n, path, offset, size) => {
  const name = path[offset]
  const next = findChild(n, name) || addChild(n, name)
  if (offset < path.length - 1)
    insert(next, path, offset + 1, size)
  else
    next.size = size
}

const toTree = (items, sep = ' > ') => {
  const root = node()
  return items.forEach(i => insert(root, i.name.split(sep), 0, i.size))
    .then(() => root.children[0])
}

module.exports = {
  toTree
}
