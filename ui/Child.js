import s from 'styled-components'
import React from 'react'
import { View } from './View'

const Container = s(View).attrs({
  horizontal: true
})`
  cursor: pointer
  &:hover {
    color: #696969
  }
`

const Count = s.span`
  width: 50px
  font-weight: bold
  font-size: 0.8em
`

export const Child = ({ name, size, onClick, style }) =>
  <Container onClick={onClick} style={style}>
    <Count>{size > 0 ? size : ''}</Count>
    {' '}
    <span>{name}</span>
  </Container>