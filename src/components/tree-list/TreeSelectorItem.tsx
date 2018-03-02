/**
 * 支持单选或者多选
 */

import React from 'react'
import ClassNames from 'classnames'
import { EmitterSubscription } from 'fbemitter'

import { List, Flex, Button, Checkbox } from 'antd-mobile'

import { TreeSelectorItemProps as TreeSelectorItemPropsType } from './PropsType'

const Item = List.Item

const isDataInSelItem = (data, selItem) => {
  if (!(data && selItem && selItem.length > 0)) {
    return false
  }
  for (let i = 0; i < selItem.length; i += 1) {
    if (selItem[i].id === data.id) {
      return true
    }
  }
  return false
}

const selected = (showSelect, selItem, rowData) => (showSelect && selItem && isDataInSelItem(rowData, selItem))

export default class TreeSelectorItem extends React.Component<TreeSelectorItemPropsType, any> {
  static defaultProps: Partial<TreeSelectorItemPropsType> = {
    prefixCls: 'amp-tree-selector-item',
  }

  subscription: EmitterSubscription
  constructor(props) {
    super(props)
    this.state = {
      selItem: [],
    }
    this.subscription = props.emitter.addListener('selEvent', (selItem) => {
      if (selItem) {
        this.setState({
          selItem,
        })
      }
    })
  }

  componentDidMount() {
    // console.log('TreeSelectorItem componentDidMount')
  }

  isDataInSelItem(data, selItem) {
    if (!(data && selItem && selItem.length > 0)) {
      return false
    }
    for (let i = 0; i < selItem.length; i += 1) {
      if (selItem[i].id === data.id) {
        return true
      }
    }
    return false
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { rowData } = this.props
    const { selItem } = this.state
    if (nextProps.rowData !== rowData) {
      return true
    }

    if (!nextState.selItem) {
      return false
    }
    // 优化性能，只刷新变化的
    if (selItem && isDataInSelItem(rowData, selItem) && !(isDataInSelItem(rowData, nextState.selItem))) {
      return true
    }

    if (selItem && !(isDataInSelItem(rowData, selItem)) && isDataInSelItem(rowData, nextState.selItem)) {
      return true
    }

    // if(this.state.selItem && this.state.selItem.id === this.props.rowID
    //   &&  nextState.selItem.id !== this.props.rowID){
    //   return true
    // }
    //
    // if((this.state.selItem || (this.state.selItem &&
    //   this.state.selItem.id !== this.props.rowID))
    //   &&  nextState.selItem.id === this.props.rowID){
    //   return true
    // }

    return false
  }

  componentWillUnmount() {
    this.subscription.remove()
  }

  render() {
    const { rowData, showSelect, onChange, toChildLevel, style, prefixCls, className } = this.props
    const sel = this.state.selItem
    const wrapCls = ClassNames(prefixCls, className)
    return (
      <Item
        className={wrapCls}
        style={style}
      >
        <Flex justify="between">
          {
            showSelect ? <Checkbox
              className={`${prefixCls}-checkbox`}
              checked={selected(showSelect, sel, rowData)}
              onChange={onChange}
            /> : ''
          }
          <span onClick={rowData.children ? toChildLevel : () => {}}>{rowData.label}</span>
          {
            rowData.children ?
              <Button className="next-level-btn" type="ghost" inline icon="right" onClick={toChildLevel} />
              :
              <Button
                className="next-level-btn"
                type="ghost"
                disabled
                inline
                icon="right"
                style={{ color: '#272727' }}
              />
          }

        </Flex>
      </Item>
    )
  }
}
