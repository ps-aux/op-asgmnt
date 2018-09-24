import s from 'styled-components'

export const View = s.div`
display: flex
flex-direction: ${p => p.horizontal ? 'row' : 'column'}
flex-grow: ${p => p.stretch ? '1' : '0'}
  `