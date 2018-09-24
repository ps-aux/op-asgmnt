import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import './style.css'
import 'semantic-ui-css/semantic.min.css'
import s from 'styled-components'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { AppContextProvider } from 'ui/AppContext'
import SynsetService from 'ui/SynsetService'
import Browse from './Browse'
import { View } from './View'
import { Divider, Input, Menu } from 'semantic-ui-react'
import { Redirect, Switch, withRouter } from 'react-router'
import SearchForm from './SearchForm'
import Search from './Search'

const Container = s(View).attrs({
  stretch: true
})`
padding: 20px
`

const synsetService = SynsetService({ apiRoot: process.env.API_ROOT || window.location.origin })

export const NavMenuItem = withRouter(({ location, path, name }) =>
  <Link to={path}>
    <Menu.Item name='editorials'
               active={location.pathname.startsWith(path)}>
      {name}
    </Menu.Item>
  </Link>)

const Navigation = () =>
  <Menu inverted>
    <NavMenuItem path={'/browse'} name={'Browse'}/>
    <NavMenuItem path={'/search'} name={'Search'}/>
  </Menu>

const App = () =>
  <AppContextProvider value={{ synsetService }}>
    <Container>
      <Router>
        <Fragment>
          <Navigation/>
          <SearchForm/>
          <Divider/>
          <Switch>
            <Route path={'/browse'} component={Browse}/>
            <Route exact path={'/search'} component={Search}/>
            <Redirect to="/browse"/>
          </Switch>
        </Fragment>
      </Router>
    </Container>
  </AppContextProvider>

ReactDOM.render(<App/>, document.getElementById('app'))