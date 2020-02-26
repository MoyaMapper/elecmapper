import { fromJS } from 'immutable';
import { OperationType, SwiftType, SwiftDefaultVal } from '../store/constants';
import fileHelper from '../../../utils/fileHelper';
import { dateFormat } from '../../../utils/dateHelper';
const { appName, organization } = require('../../../common/constants');

const { remote } = window.require('electron');

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
  // console.log(newData)
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

const handleJsonDataArrToSwiftPropsStr = (jsonDataArr, saveDirPath) => {
  let contentArr = [ ]
  const date = new Date()
  const year = date.getFullYear()
  const dateStr = dateFormat(date, "yyyy/MM/dd")

  for (let i = 0; i < jsonDataArr.length; i++) {
    let p = jsonDataArr[i]
    let type = p.type
    let key = p.jsonkey
    switch (type) {
      case SwiftType.int:
        contentArr.push(`    var ${key} : ${type} = ${SwiftDefaultVal.int} \n`)
        break;
      case SwiftType.bool:
        contentArr.push(`    var ${key} : ${type} = ${SwiftDefaultVal.bool} \n`)
        break;
      case SwiftType.float:
        contentArr.push(`    var ${key} : ${type} = ${SwiftDefaultVal.float} \n`)
        break;
      case SwiftType.double:
        contentArr.push(`    var ${key} : ${type} = ${SwiftDefaultVal.double} \n`)
        break;
      case SwiftType.string:
        contentArr.push(`    var ${key} : ${type} = ${SwiftDefaultVal.string} \n`)
        break;
      case SwiftType.array:
        contentArr.push(`    var ${key} : ${type} = ${SwiftDefaultVal.array} \n`)
        break;
      default: // 自定义的类名，创建文件
        contentArr.push(`    var ${key} : ${type} = ${type}\(\) \n`)
        
        let arr = [`//
//  MultipleModel.swift
//
//  Created by ${appName} on ${dateStr}.
//  Copyright © ${year}年 ${organization}. All rights reserved.
//
import SwiftyJSON
import MoyaMapper

struct ${type}: Modelable {
`

        ]
        const content = handleJsonDataArrToSwiftPropsStr(p.children, saveDirPath)
        arr.push(content)
        arr.push(` 
    mutating func mapping(_ json: JSON) {
        
    }
}
        `)
        const saveFilePath = `${saveDirPath}/${type}.swift`
        fileHelper.writeFile(saveFilePath, arr.join(''))
        break;
    }
  }
  contentArr.push()
  return contentArr.join('')
}

export const exportSwiftModelFile = (jsonDataArr, callback=null) => {
  if (jsonDataArr.length < 1)
    return
  remote.dialog.showOpenDialog({
    title: '选择存储位置',
    properties: ['openDirectory']
  }).then((result) => {
    if (result.canceled || result.filePaths.length < 1)
      return
    
    // 目录路径
    const filePath = result.filePaths[0]
    handleJsonDataArrToSwiftPropsStr(jsonDataArr, filePath)
    if (callback)
      callback()
  })
}