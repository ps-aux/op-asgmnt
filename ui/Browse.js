import React, { Fragment } from 'react'
import { lifecycle, withProps, withStateHandlers } from 'recompose'
import { View } from './View'
import { withRouter } from 'react-router'
import { compose } from 'ramda'
import { parse } from 'query-string'
import { Spinner } from './Spinner'
import { withTree } from './withTree'
import { Children } from './Children'
import s from 'styled-components'

const PathContainer = s(View)`
  color: 'black'
  cursor: pointer
`

const Segment = s.button`
  cursor: pointer
  background: none
  border: none
  color: black
  font-weight: 600
`

const PathNavigator = ({ path, back, returnToIndex }) =>
  <PathContainer>
    {/*{path.length > 1 && <button onClick={back}>Back</button>}*/}
    <div>
      {path.map((el, i) =>
        <Fragment key={el}>
          <Segment onClick={() => returnToIndex(i)}>{el}</Segment>
          {i < path.length - 1 && <span>{' > '}</span>}
        </Fragment>)}
    </div>
  </PathContainer>

const BrowseUi = ({ path, back, push, node, returnToIndex }) =>
  <View stretch>
    <PathNavigator path={path}
                   returnToIndex={returnToIndex}
                   back={back}/>
    {node ? <Children onItemClick={c => push(c.name)}>
      {node.children}
    </Children> : <Spinner/>}
  </View>

export default compose(
  withRouter,
  withTree(),
  withProps(({ history, tree }) => {

    const first = '/' + tree.name
    let { path: pathQuery = first } = parse(history.location.search)
    if (!pathQuery.startsWith(first)) {
      pathQuery = first
    }
    const currentPath = pathQuery.split('/').slice(1)
    return {
      path: currentPath,
      back: () => history.goBack(),
      push: name => {
        const newPath = currentPath.slice()
        newPath.push(name)
        history.push({
          ...history.location,
          search: `path=/` + newPath.join('/')
        })
      },
      returnToIndex: i => {
        const newPath = currentPath.slice(0, i + 1)
        history.replace({
          ...history.location,
          search: `path=/` + newPath.join('/')
        })
      }
    }
  }),
  withStateHandlers({
      node: null,
    },
    {
      setNode: () => node => ({ node })
    }),
  lifecycle({
    fetchData () {
      this.props.setNode(null)
      this.props.getNode(this.props.path)
        .then(this.props.setNode)
    },

    componentDidMount () {
      this.fetchData()
    },
    componentDidUpdate (prevProps) {
      if (this.props.location.key !== prevProps.location.key &&
        this.props.location.search !== prevProps.location.search) {
        this.fetchData()
      }
    }
  }))
(BrowseUi)