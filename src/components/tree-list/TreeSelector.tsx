/*
 数据结构:

 列表结构
 [
 {
 "id": "CCD0000057",
 "parent": "CCD0000001",
 "label": "信用卡中心办公室",
 "data": {
 },
 "children": true(异步获取) | ['CCD01','CCD02'] (同步初始化)，
 "type": 'root' | 'others',
 "status": "还没用上"
 }
 ]

 转化为字典结构 treeMap
 {
 "CCD0000057": {
 "id": "CCD0000057",
 "parent": "CCD0000001",
 "label": "信用卡中心办公室",
 "data": {
 },
 "children": true(异步获取) | ['CCD01','CCD02'] (同步初始化)，
 "type": 'root' | 'others',
 "status": "还没用上"
 }

 }

 默认Root

 {
 "root": {
 id: "root",
 label : "根目录",
 children: true | []

 }

 }

 传参：

 1. value, 当前选中节点对象，可以不传

 2. current 当前显示current的children , 必须传current是当前显示节点对象, children可以是true或者直接是数组，如果是true需要调用
 传入的fetchChildren来获取结果，同时赋值true为数组, 另外 id === root 的是根节点，

 3. fetchChildren 异步或者同步的获取方法, 如果无法从Tree数据字典获得，有一个回调能够传入id返回Promise， 在Promise的then中获取结果，
 结果是列表, 中间需要延迟的Loading动画，获取数据列表，merge到treeMap，然后修改children从true到id数组

 4. storageKeyPrefix, sessionStorage Key的前缀，可以不传

 5. showSelect 是否显示选择框

 6. showDelay 同indexedlist

 7. onChange
 8. onCurrentChange也可以触发

 注意：
 1. 初始化构造一个堆栈，用来支持面包屑导航，判断是否在字典中存在parent，如果存在可以插入id, 并向上递归 ; 如果不存在，判断是否支持异步，支持的化
 可以插入id，label是上一级，并置一个异步状态。 如果parent为空，则停止。

 2.  selector应该只处理current相关， 其他属性直传给TreeList
 3.  treeMap 放到session storage , 不断的merge
 4.  第二次进入页面，应用恢复场景可以缓存value值和current值到model或者到sessionStorage
 5.  每次需要渲染时发现node.children是数组，可以检查一下数组是否为空，或者里面的id是否都在treeMap,否则置为true，重新fetchChildren

 */
import React from 'react'
import ClassNames from 'classnames'
import { List, Modal, Button, Flex, Icon } from 'antd-mobile'
import { TreeSelectorProps as TreeSelectorPropsType } from './PropsType'
import TreeList from './TreeList'

import { isIOS } from './TreeListUtils'

const Item = List.Item;

export default class TreeSelector extends React.PureComponent<TreeSelectorPropsType, any> {

  static defaultProps: Partial<TreeSelectorPropsType> = {
    prefixCls: 'amp-tree-selector',
    current: {
      id: 'root',
      label: 'root',
      children: false,
    },
    value: [],
  }

  constructor(props) {
    super(props)
    const { value } = props
    this.state = {
      showTreeListModal: false,
      value,
    }
  }

  openModal = () => {
    this.setState({
      showTreeListModal: true,
    })
  }

  confirmModal = () => {
    const { onChange } = this.props
    this.setState({
      showTreeListModal: false,
    })
    // 确定才回调外层onChange
    if (onChange) {
      onChange(this.state.value)
    }
  }

  closeModal = () => {
    this.setState({
      showTreeListModal: false,
      value: this.props.value,
    })
  }

  onChange = (value) => {
    if (value !== this.state.value) {
      this.setState({
        value,
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.state.value) {
      this.setState({
        value: nextProps.value,
      })
    }
  }

  render() {
    const { value } = this.state
    const { current, fetchChildren, storageKeyPrefix, multipleSelect, style, prefixCls, className } = this.props
    const wrapCls = ClassNames(prefixCls, className)
    return (
      <div className={wrapCls} style={style}>
        {/* <Item extra="点击切换" arrow="down" onClick={this.openModal}>{value[0]? value[0].label : '请选择'}</Item> */}
        <div style={{ display: 'flex' }} onClick={this.openModal}>
          <Item style={{ width: '90%' }} extra={value[0] ? value[0].label : '请选择'}>组织机构</Item>
          <div style={{ width: '10%' }}>
            <span className="dovs"><Icon type="right" className="dovs1" /></span>
          </div>
        </div>
        <Modal
          visible={this.state.showTreeListModal}
          className="amp-full-selector-modal"
        >
          <div
            className={
            ClassNames({
              'modal-title': true,
              'ios-modal-title': isIOS(),
            })
          }
          >
            <Flex justify="end">
              <Flex.Item><Button className="but" onClick={this.closeModal}>取消</Button></Flex.Item>
              <Flex.Item><Button className="but" onClick={this.confirmModal}>确定</Button></Flex.Item>
            </Flex>
          </div>
          <TreeList
            current={current}
            fetchChildren={fetchChildren}
            storageKeyPrefix={storageKeyPrefix}
            value={value}
            onChange={(val) => { this.onChange(val) }}
            showSelect
            multipleSelect={multipleSelect}
          />
        </Modal>
      </div>
    );
  }
}
