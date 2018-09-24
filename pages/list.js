// @flow

import * as React from 'react'
import { AutoSizer, List, WindowScroller } from 'react-virtualized'

export default class WindowScrollerExample extends React.PureComponent {

  state = {
    show: false
  }

  componentDidMount () {
    this.setState({ show: true })
  }

  setRef = el => {
    this.el = el
  }

  render () {
    return <div>
      <header>
        <h1>header</h1>
      </header>
      {this.state.show && (<WindowScroller
          ref={this._setRef}
          scrollElement={window.listEl}>
          {({ height, isScrolling, registerChild, onChildScroll, scrollTop }) => (
            <div style={{
              flex: '1 1 auto'
            }}>
              <AutoSizer disableHeight>
                {({ width }) => (
                  <div ref={registerChild}>
                    <List
                      ref={el => {
                        window.listEl = el
                      }}
                      autoHeight
                      style={{
                        border: '1px solid #e0e0e0'
                      }}
                      height={height}
                      isScrolling={isScrolling}
                      onScroll={onChildScroll}
                      overscanRowCount={2}
                      rowCount={1000}
                      rowHeight={30}
                      rowRenderer={this._rowRenderer}
                      scrollTop={scrollTop}
                      width={width}
                    />
                  </div>
                )}
              </AutoSizer>
            </div>
          )}
        </WindowScroller>
      )}
    </div>
  }

  _hideHeader = () => {
    const { showHeaderText } = this.state

    this.setState(
      {
        showHeaderText: !showHeaderText,
      },
      () => {
        if (this._windowScroller) {
          this._windowScroller.updatePosition()
        }
      },
    )
  }

  _rowRenderer = ({ index, isScrolling, isVisible, key, style }) => {
    return (
      <div key={key} style={style}>
        {index}
      </div>
    )
  }

  _setRef = windowScroller => {
    this._windowScroller = windowScroller
  }

  _onCheckboxChange = event => {
    this.context.setScrollingCustomElement(event.target.checked)
  }

  _onScrollToRowChange = event => {
    const { list } = this.context
    let scrollToIndex = Math.min(
      list.size - 1,
      parseInt(event.target.value, 10),
    )

    if (isNaN(scrollToIndex)) {
      scrollToIndex = undefined
    }

    setTimeout(() => {
      this.setState({ scrollToIndex })
    }, 0)
  }
}