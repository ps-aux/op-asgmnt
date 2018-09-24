import React from 'react'
import { withRouter } from 'react-router'
import { lifecycle, withProps, withStateHandlers } from 'recompose'
import { compose } from 'ramda'
import { View } from './View'
import { withAppCtx } from './AppContext'
import { Input } from 'semantic-ui-react'
import { parse } from 'query-string'

const SearchForm = ({ value, onChange, onSubmit }) =>
  <View horizontal>
    <form onSubmit={e => (e.preventDefault(), onSubmit())}>
      <Input icon="search"
             action="Search"
             iconPosition="left"
             placeholder="Search"
             value={value}
             onChange={e => onChange(e.target.value)}/>
    </form>
  </View>

export default compose(
  withRouter,
  withProps(({ location }) =>
    ({
      query: parse(location.search).q || ''
    })),
  withStateHandlers(
    ({ query }) => ({ value: query, searching: false, results: null }),
    {
      onChange: () => value => ({ value }),
    }),
  withAppCtx(),
  withProps(({ value, history }) => ({
    onSubmit: () => {
      history.push(`/search?q=${value}`)
    }
  })),
  lifecycle({
    componentDidUpdate (prevProps) {
      if (this.props.location.key !== prevProps.location.key) {
        this.props.onChange(this.props.query)
      }
    }
  }))(SearchForm)