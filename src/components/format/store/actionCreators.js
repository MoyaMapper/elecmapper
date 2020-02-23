import * as constants from './constants';
import { v4 as uuidv4 } from 'uuid';

export const switchShowType = (value) => ({
  type: constants.SWITCH_SHOW_TYPE,
  value
})

const newFinalJsonData = (value) => ({
  type: constants.NEW_FINAL_JSON_DATA,
  value
})

export const transformJsonData = (json) => {
  return (dispatch) => {
    let obj = eval('(' + json + ')')
    let dataArr = []
    for(let key in obj) {
      let value = obj[key]
      // console.log(key, typeof value)
      let type = 'String'
      switch (typeof value) {
        case 'string':
          type = 'String'
          break;
        case 'boolean':
          type = 'Bool'
          break;
        case 'number':
          let arr = value.toString().split('.')
          if (arr.length>1) {
            type = 'Float'
          } else {
            type = 'Int'
          }
          break;
        default:
          continue;
      }
      dataArr.push({ key: uuidv4(), jsonkey: key, type })
    }
    dispatch(newFinalJsonData(dataArr))
  }
}