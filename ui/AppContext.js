import React from 'react'

const { Provider, Consumer } = React.createContext('app')

export const AppContextProvider = Provider

export const withAppCtx = (ctx2Props = x => x) => Comp => props =>
  <Consumer>
    {ctx => <Comp {...ctx} {...{ ...props, ...ctx2Props(ctx, props) }}/>}
  </Consumer>

