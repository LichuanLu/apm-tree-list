/**
 * Created by lichuan on 17/9/8.
 */
/*
*  saveGet sessionStorage
*  转换list to hash
*  merge 新 hash到 老hash
*
* */
import { ListView } from 'antd-mobile';
const engine = require('store/src/store-engine');
const sessionStorage = require('store/storages/sessionStorage');
const memoryStorage = require('store/storages/memoryStorage');
const storages = [sessionStorage, memoryStorage];
const store = engine.createStore(storages);
// TODO: use section and row with indexed list
const dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});
// TODO: add prefix to the key to prevent conflict
export const config = {
    TREE_LEVEL_STACK: 'treeLevelStack',
    TREE_MAP: 'treeMap',
};
export const defaultRoot = {
    id: 'root',
    children: true,
    label: '根入口',
    type: 'root',
};
export function getStore() {
    // read: function(key) { ... },
    // write: function(key, value) { ... },
    // each: function(fn) { ... },
    // remove: function(key) { ... },
    // clearAll: function() { ... }
    return store;
}
export function mergeTreeMap(origin, latest) {
    return Object.assign(origin, latest);
}
/**
 * 初始化层级堆栈结构，默认先从store里面拉，如果current存在，current第一个的parent在默认结构里面，从parent往后面的都POP掉
 * 如果不在，压 parent ID进去，递归如果parent.parent能找到就继续放到栈顶，treeMap找不到就停，如果parent false的话也停
 * a. parent false或者空不需要显示上一页 b. parent只要有值就显示上一页(但是如果treeMap找不到parent.parent，目前没有接口能取，因此点击上一页没效果)
 * c. (optional) 如果parent在treeMap能找到可以考虑面包屑
 * @param current
 * @param treeMap
 */
export function initTreeLevelStack(current, treeMap) {
    const treeLevelStack = [];
    // const cachedStack = getStore().get(config.TREE_LEVEL_STACK)
    if (current) {
        // TODO: 先检查是否在cachedStack中, 恢复原始环境
        treeLevelStack.push(current.id);
        let temp = current.parent;
        // 回溯到头
        while (temp && treeMap[temp]) {
            treeLevelStack.unshift(treeMap[temp].parent);
            temp = treeMap[temp].parent;
        }
    }
    return treeLevelStack;
}
/**
 * 传入当前node obj, 合并到
 * @param treeMap
 */
export function updateTreeMap(target) {
    const cachedTreeMap = getStore().get(config.TREE_MAP);
    const newTreeMap = (typeof cachedTreeMap === 'object') ? mergeTreeMap(cachedTreeMap, target) : target;
    getStore().set(config.TREE_MAP, newTreeMap);
    return newTreeMap;
}
export function getTreeMap() {
    const cachedTreeMap = getStore().get(config.TREE_MAP);
    return cachedTreeMap || {};
}
// 用于从value恢复current, 可以让应用少请求一次
export function getSameLevelFromCache(id) {
    let res = null;
    const cachedTreeMap = getStore().get(config.TREE_MAP);
    if (cachedTreeMap && cachedTreeMap[id] && cachedTreeMap[id].parent && cachedTreeMap[cachedTreeMap[id].parent]) {
        res = cachedTreeMap[cachedTreeMap[id].parent].children;
    }
    return res;
}
// 转换fetch获得的list数据结构到treeMap
export function convertListToMap(list) {
    const res = {};
    list.forEach((item) => {
        res[item.id] = item;
    });
    return res;
}
// dataSource.cloneWithRows(dataBlob)
export function initDataSourceCloneWithRows(current, treeMap) {
    // TODO: 生成dataBlob最好排序
    let dataBlob = {};
    const cc = current.children;
    if (cc && Array.isArray(cc)) {
        for (let i = 0; i < cc.length; i += 1) {
            // 如果child存在，生成list数据
            if (treeMap[cc[i]]) {
                dataBlob[cc[i]] = treeMap[cc[i]];
            }
            else {
                // reset current children , in order to reFetch
                current.children = true;
                dataBlob = {};
                break;
            }
        }
    }
    return dataSource.cloneWithRows(dataBlob);
}
// TODO: dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs)
// export function initDataSourceCloneWithRowsAndSections(treeMap) {
// }
// const initDataSource = function (dataList, dataHash){
//   let dataBlob = {}, sectionIDs = [] , rowIDs = []
//   Object.keys(dataList).forEach((item, index) => {
//     sectionIDs.push(item)
//     dataBlob[item] = item
//     rowIDs[index] = []
//
//     dataList[item].forEach((jj) => {
//       rowIDs[index].push(jj.value)
//       dataBlob[jj.value] = jj.label
//       dataHash[jj.value] = jj
//     })
//   })
//
//   return dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs)
// }
export function isIOS() {
    const ua = window.navigator.userAgent;
    return !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
}
// 会修改源array
export function filterFromArray(array, predicate) {
    if (!(array != null && array.length)) {
        return [];
    }
    return array.filter(predicate);
}
//
// export function diffArray(origin, target){
//   return origin.filter(function(i){
//     return target.indexOf(i) < 0
//   })
// }
