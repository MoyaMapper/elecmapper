import { fromJS } from 'immutable';
import { OperationType } from '../store/constants';

// 将 format 下的 jsonDataArr 进行平铺, 并添加下标数组 indexArr
// 调用：flattenFormatDataArr(jsonDataArr)
export const flattenFormatDataArr = (arr, map = null, initIndexArr = []) => {
  return arr.reduce((curMap, item, index) => {
    let operaMap = map ? map : curMap
    if (!item.arrIndex) {
      item.indexArr = fromJS(initIndexArr).toJS()
    }
    item.indexArr.push(index)

    operaMap[item.key] = item
    if (item.children && item.children.length) {
      flattenFormatDataArr(item.children, operaMap, item.indexArr)
    }
    return operaMap
  }, {})
}

const operateItemFromJsonData = (operationType, jsonDataArr, item, newVal) => {
  let newData = fromJS(jsonDataArr).toJS()
  let p = newData // 游标
  const indexArr = item.indexArr
  const indexArrLength = indexArr.length
  for (let i = 0; i < indexArrLength; i++) {
    const curIndex = indexArr[i]
    if (i === indexArrLength - 1) { // 最后的一个下标
      switch (operationType) {
        case OperationType.modifyTitle:
          p = p[curIndex]
          p.jsonkey = newVal;
          continue;
        case OperationType.switchSwiftType:
        case OperationType.modifyClassName:
          p = p[curIndex]
          p.type = newVal;
          continue;
        case OperationType.delete:
          // 从数组中移除
          p.splice(curIndex, 1);
          continue;
        default:
          continue;
      }
    }
    // 非最后一个，必有children
    p = p[curIndex].children
  }
  console.log(newData)
  return newData
}

// 删除操作
export const deleteItemFromJsonData = (jsonDataArr, item) => {
  return operateItemFromJsonData(OperationType.delete, jsonDataArr, item)
}

// 修改标题
export const modifyItemTitle = (jsonDataArr, item, newVal) => {
  return operateItemFromJsonData(OperationType.modifyTitle, jsonDataArr, item, newVal)
}

// 切换类型
export const switchItemType = (jsonDataArr, item, newVal) => {
  return operateItemFromJsonData(OperationType.switchSwiftType, jsonDataArr, item, newVal)
}

// 修改类名
export const modifyItemClassName = (jsonDataArr, item, newVal) => {
  return operateItemFromJsonData(OperationType.modifyClassName, jsonDataArr, item, newVal)
}