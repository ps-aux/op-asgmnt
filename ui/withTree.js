import { withAppCtx } from './AppContext'
import { branch, lifecycle, renderComponent, withProps, withStateHandlers } from 'recompose'
import { Spinner } from './Spinner'
import { compose } from 'ramda'
import React from 'react'

const find = (n, path,
              offset = 0) => {
  if (offset === path.length - 1)
    return n
  const name = path[offset + 1]
  const next = n.children.find(c => c.name === name)
  return find(next, path, offset + 1)
}

// Intentional async API for extensibility
const getNode = (n, path) => new Promise(res => {
  const r = find(n, path)

  setTimeout(() => res(r), 0)
})

export const withTree = () =>
  compose(
    withStateHandlers({ tree: null }, {
      setTree: () => tree => ({ tree })
    }),
    withAppCtx(),
    lifecycle({
        componentDidMount () {
          this.props.synsetService.tree()
            .then(this.props.setTree)
        }
      }
    ),
    branch(({ tree }) => !tree,
      renderComponent(() => <Spinner text="fetching tree"/>)),
    withProps(({ tree }) => ({
      getNode: path => getNode(tree, path)
    })))