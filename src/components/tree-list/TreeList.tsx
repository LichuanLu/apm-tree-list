/* tslint:disable:jsx-no-multiline-js */
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

 1. value, 当前选中节点对象列表，可以不传

 2. current 当前显示current的children , 必须传current是当前显示节点对象, children可以是true或者直接是数组，如果是true需要调用
 传入的fetchChildren来获取结果，同时赋值true为数组, 另外 id === root 的是根节点，

 3. fetchChildren 异步或者同步的获取方法, 如果无法从Tree数据字典获得，有一个回调能够传入id返回Promise， 在Promise的then中获取结果，
 结果是列表, 中间需要延迟的Loading动画，获取数据列表，merge到treeMap，然后修改children从true到id数组

 4. storageKeyPrefix, sessionStorage Key的前缀，可以不传

 5. showSelect 是否显示选择框

 6. showDelay 同indexedlist

 7. onChange

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
import { EventEmitter } from 'fbemitter'
import { ListView, NavBar } from 'antd-mobile'
import { initTreeLevelStack, updateTreeMap, initDataSourceCloneWithRows, convertListToMap,
  filterFromArray }from './TreeListUtils'
import TreeSelectorItem from './TreeSelectorItem'
import { TreeListProps as TreeListPropsType, TreeNodeProps as TreeNodePropsType } from './PropsType'

// TODO: 可以考虑实现一个showSelect的属性来关闭select
export default class TreeList extends React.PureComponent<TreeListPropsType, any> {
  static defaultProps: Partial<TreeListPropsType> = {
    prefixCls: 'amp-tree-list',
    current: {
      id: 'root',
      label: 'root',
      children: false,
    },
    value: [],
    showSelect: true,
    storageKeyPrefix: '',
    initialListSize: 200,
  }

  emitter: EventEmitter
  treeMap: {
    [id: string]: TreeNodePropsType,
  }

  constructor(props) {
    super(props)
    const { current } = props
    // 注入新的current到treeMap
    this.initTreeMap(current)
    this.state = {
      loading: false,
      current,
      treeLevelStack: initTreeLevelStack(current, this.treeMap),
      listData: initDataSourceCloneWithRows(current, this.treeMap),
    }
    this.emitter = new EventEmitter()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.current !== this.props.current) {
      this.initTreeMap(nextProps.current)
      this.setState({
        current: nextProps.current,
        treeLevelStack: initTreeLevelStack(nextProps.current, this.treeMap),
        listData: initDataSourceCloneWithRows(nextProps.current, this.treeMap),
      })
    }
  }

  initTreeMap(current) {
    const temp = {}
    temp[current.id] = current
    this.treeMap = updateTreeMap(temp)
  }

  // shouldComponentUpdate(nextProps, nextState){
  //   //优化性能，props setItem变化不会刷新，刷新放到内部组件
  //   if(nextState.data !== this.state.data){
  //     return true
  //   }
  //   return false
  // }

  fetchAndUpdateCurrent() {
    // fetchChildren, 建议异步fetch实现 toast loading
    const { current } = this.state
    const { fetchChildren } = this.props
    if (current.children === true) {
        const fetchPromise = fetchChildren ? fetchChildren(current.id) : Promise.resolve()
        fetchPromise.then((list) => {
        if (list && list.length > 0) {
          const newMap = convertListToMap(list)
          // update current
          current.children = Object.keys(newMap)
          newMap[current.id] = current
          // merge to treeMap
          this.treeMap = updateTreeMap(newMap)
          // 重置状态，触发渲染
          this.setState({
            current,
            listData: initDataSourceCloneWithRows(current, this.treeMap),
          })
        }
      })
    }
  }

  componentDidMount() {
    // 渲染对应的选中item
    this.emitter.emit('selEvent', this.props.value)
    this.fetchAndUpdateCurrent()
  }

  componentDidUpdate(prevProps, prevState) {
    const { value } = this.props
    // 渲染对应的选中item
    if (prevProps.value !== value || prevState.listData !== this.state.listData) {
      this.emitter.emit('selEvent', value)
    }
    this.fetchAndUpdateCurrent()
  }

  componentWillUnmount() {
    this.emitter.removeAllListeners()
  }

  // 选择Radio
  onChange(rowID) {
    const { value = [], multipleSelect, onChange } = this.props
    let result: Array<TreeNodePropsType> = []
    // 先删除已有的
    result = filterFromArray(value, val => (val.id !== rowID))
    if (result.length === value.length) {
      if (!multipleSelect) {
        // 单选需要清空result
        result = []
      }
      result.push(this.treeMap[rowID])
    }
    if (onChange) {
      onChange(result)
    }
  }

  // 指定id的children level
  toChildLevel(id) {
    const { treeLevelStack } = this.state
    const newCurrent = this.treeMap[id]
    treeLevelStack.push(newCurrent.id)
    this.setState({
      current: newCurrent,
      listData: initDataSourceCloneWithRows(newCurrent, this.treeMap),
    })
  }

  // 返回上层
  backToPrevLevel() {
    const { current, treeLevelStack } = this.state
    treeLevelStack.pop()
    if (current.parent && this.treeMap[current.parent]) {
      const newCurrent = this.treeMap[current.parent]
      this.setState({
        current: newCurrent,
        listData: initDataSourceCloneWithRows(newCurrent, this.treeMap),
      })
    } else if (this.treeMap.root) {
      const newCurrent = this.treeMap.root
      this.setState({
        current: newCurrent,
        treeLevelStack: ['root'],
        listData: initDataSourceCloneWithRows(newCurrent, this.treeMap),
      })
    } else {
      alert('回退错误, 数据异常，请刷新页面')
    }
  }

  getBreadcrumbView(treeLevelStack, current) {
    // TODO: 考虑支持可滑动tab，可以实现面包屑
    if (treeLevelStack.length !== 1) {
      return (
        <NavBar
          leftContent={<span>上一级</span>}
          mode="dark"
          onLeftClick={() => this.backToPrevLevel()}
        >{current.label}
        </NavBar>
      )
    }
    return (
      <NavBar
        mode="dark"
        iconName={null}
        leftContent={current.label}
      />
    )
  }

  render() {
    const { prefixCls, showSelect, showDelay, initialListSize, className, style } = this.props
    const { current, treeLevelStack, listData } = this.state
    const wrapCls = ClassNames(prefixCls, className)
    return (
      <div className={wrapCls} style={style}>
        {this.getBreadcrumbView(treeLevelStack, current)}
        <ListView
          initialListSize={initialListSize}
          dataSource={listData}
          renderFooter={() => <span>没有更多数据了</span>}
          renderRow={(rowData, _sectionID, rowID) => (
            <TreeSelectorItem
              onChange={() => this.onChange(rowID)}
              showSelect={showSelect}
              rowData={rowData}
              emitter={this.emitter}
              toChildLevel={() => this.toChildLevel(rowID)}
            />
          )}
          className={`${prefixCls}-view`}
          delayTime={showDelay ? 500 : 0}
        />
      </div>
    )
  }
}
