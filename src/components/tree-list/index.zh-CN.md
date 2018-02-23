

## Tree List

#### 说明：

树形展示和选择，支持异步加载和结果缓存

#### 依赖:

antd-mobile 2.x, React 16

## API

适用平台：WEB

### TreeList

| 属性                | 说明                            | 类型                                    | 默认值  |
| ----------------- | ----------------------------- | ------------------------------------- | ---- |
| style?            | 样式                            | any                                   |      |
| prefixCls?        | css类名前缀                       | string                                |      |
| className?        | css类名                         | string                                |      |
| current           | 当前展示的树节点                      | TreeNodeProps                         |      |
| value?            | 选中的值                          | Array<string>                         |      |
| onChange?         | 选择变化回调                        | (value: Array<TreeNodeProps>) => void |      |
| storageKeyPrefix? | 缓存key前缀                       | string                                |      |
| fetchChildren?    | 根据当前节点获取叶子节点数据的方法             | (currentID: string) => Promise;       |      |
| multipleSelect?   | 是否支持多选                        | boolean                               |      |
| initialListSize?  | 列表初始大小(同antd-mobile listview) | number                                |      |
| showSelect?       | 是否支持选择                        | boolean                               |      |
| showDelay?        | 显示延迟(同antd-mobile listview)   | number                                |      |



