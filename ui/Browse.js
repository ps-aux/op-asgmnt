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
import { Icon } from 'semantic-ui-react'

const PathContainer = s(View)`
  color: 'black'
  cursor: pointer
  align-item: center
`
const Segment = s.button`
  cursor: pointer
  background: none
  border: none
  color: black
  font-size: 1.1em
  font-weight: 600
`

const BackButton = ({onClick}) =>
  <Icon name="angle left"
        style={{
          cursor: 'pointer'
        }}
        onClick={onClick}/>

const PathNavigator = ({path, back, canBack, returnToIndex}) =>
  <PathContainer horizontal>
    {canBack && <BackButton onClick={back}/>}
    <View horizontal>
      {path.map((el, i) =>
        <Fragment key={el}>
          <Segment onClick={() => returnToIndex(i)}>{el}</Segment>
          {i < path.length - 1 && <span>{' > '}</span>}
        </Fragment>)}
    </View>
  </PathContainer>

const BrowseUi = ({path, back, canBack, push, node, returnToIndex}) =>
  <View stretch>
    <PathNavigator path={path}
                   canBack={canBack}
                   returnToIndex={returnToIndex}
                   back={back}/>
    {node ? <Children onItemClick={c => push(c.name)}>
      {node.children}
    </Children> : <Spinner/>}
  </View>

export default compose(
  withRouter,
  withTree(),
  withProps(({history, tree}) => {

    const first = '/' + tree.name
    let {path: pathQuery = first} = parse(history.location.search)
    if (!pathQuery.startsWith(first)) {
      pathQuery = first
    }
    const currentPath = pathQuery.split('/').slice(1)

    const returnToIndex = i => {
      const newPath = currentPath.slice(0, i + 1)
      history.replace({
        ...history.location,
        search: `path=/` + newPath.join('/')
      })
    }

    return {
      path: currentPath,
      back: () => returnToIndex(currentPath.length - 2),
      canBack: currentPath.length > 1,
      push: name => {
        const newPath = currentPath.slice()
        newPath.push(name)
        history.push({
          ...history.location,
          search: `path=/` + newPath.join('/')
        })
      },
      returnToIndex
    }
  }),
  withStateHandlers({
      node: null,
    },
    {
      setNode: () => node => ({node})
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