## apollo mobile tree list


#### 代码结构说明
```
  --.storybook           storybook配置
    --css                storybook需要的样式
  --dist                 webpack打包生成的js和css，用于传统非CMD或者AMD方式引入
  --es                   typescript编译成 ecmascript模块代码，用于业务代码使用es6的时候引入
  --lib                  typescript编译成cmd模块代码，用于普通cmd模块引入（比如nodejs后台）
  --scripts              项目需要用的脚本
  --src                  项目代码
    --components         组件代码
      --style            项目组件通用样式
      --tree-list        tree-list组件
        --__tests__      单元测试
        --locale         I18N相关文件
        --stories        storybook demo
        --style          tree-list组件样式
        index.tsx        tree-list模块入口
        index.md         组件文档
      index.tsx          组件库总体入口
  --tests                单元测试相关配置
  --typings              typescript相关配置
  .eslintrc.js           eslint相关配置
  .jest.js               jest单元测试相关配置
  .stylelintrc           stylelint相关配置
  index.js               项目入口
  tsconfig.json          typescript配置
  tslint.json            typescript配置
```

###使用说明
```
  npm run dist:webpack
```  
用webpack打包到dist文件

```
  npm run compile
```
输出es编译和cmd编译结果

```
  npm run storybook
```
启动storybook查看demo

```
  npm run storybook-build
```
输出静态storybook-builod

```
  npm run lint
```
代码检查


