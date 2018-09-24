import React from 'react'
import { Loader } from 'semantic-ui-react'

//{/*<div>{text}...</div>*/}
export const Spinner = ({ text = 'fetching' }) =>
  <Loader active={true}/>
