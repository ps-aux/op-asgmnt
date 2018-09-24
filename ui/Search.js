import React from 'react'
import { withRouter } from 'react-router'
import { branch, lifecycle, renderComponent, withProps, withStateHandlers } from 'recompose'
import { complement, compose, prop } from 'ramda'
import { Spinner } from './Spinner'
import { View } from './View'
import { withAppCtx } from './AppContext'
import { Children } from './Children'
import s from 'styled-components'
import { parse } from 'query-string'

const Centered = s(View).attrs({
  stretch: true
})`
  align-items: center
  justify-content: center
`

const Search = compose(
  branch(prop('searching'), renderComponent(Spinner)),
  branch(complement(prop('results')), renderComponent(() => <Centered> Enter searched term </Centered>))
)(({ value, onChange, onSubmit, results, searching, onResultClick }) =>
  <View stretch>
    {results.length > 1 ?
      <Children onItemClick={onResultClick}>
        {results}
      </Children>
      : <Centered>No results</Centered>}
  </View>)

export default compose(
  withRouter,
  withStateHandlers({ searching: false, results: null }, {
    searchStarted: () => () => ({ searching: true }),
    searchEnded: () => results => ({ searching: false, results })
  }),
  withAppCtx(),
  withProps(({ value, searchStarted, searchEnded, history, synsetService }) => ({
    onResultClick: ({ name }) => {
      const p = '/' + name.split(' > ').join('/')
      history.push(`/browse?path=${p}`)
    }
  })),
  lifecycle({
    fetchData () {
      const { location, searchStarted, searchEnded, synsetService } = this.props
      const { q: query } = parse(location.search)
      if (!query)
        return

      searchStarted()
      synsetService.search({ query })
        .then(searchEnded)

    },
    componentDidMount () {
      // searchStarted()
      // synsetService.search({ query: value })
      //   .then(searchEnded)
      this.fetchData()
    },
    componentDidUpdate (prevProps) {
      if (this.props.location.key !== prevProps.location.key &&
        this.props.location.search !== prevProps.location.search) {
        this.fetchData()
      }
    }
  })
)(Search)