import { AutoSizer, List } from 'react-virtualized'
import { Child } from './Child'
import React from 'react'

export const Children = ({ children, onItemClick }) =>
  <div style={{ flex: '1 1 auto' }}>
    <AutoSizer style={{ flexGrow: 1 }}>
      {({ height, width }) => (
        <List height={height}
              rowHeight={20}
              rowCount={children.length}
              rowRenderer={
                ({ index, key, style }) => {
                  const c = children[index]
                  return <Child {...children[index]}
                                key={key}
                                style={style}
                                onClick={() => onItemClick(c)}/>
                }}
              width={width}
        />
      )}
    </AutoSizer>
  </div>