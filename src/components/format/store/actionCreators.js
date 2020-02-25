import * as constants from './constants';
import { v4 as uuidv4 } from 'uuid';

const SwiftType = constants.SwiftType;

export const switchShowType = (value) => ({
  type: constants.SWITCH_SHOW_TYPE,
  value
})

const newFinalJsonData = (value) => ({
  type: constants.NEW_JSON_DATA,
  value
})

export const updateJsonData = (value) => ({
  type: constants.UPDATE_JSON_DATA,
  value
})

const handleJsonData = (obj) => {
  let dataArr = []
  for (let key in obj) {
    let value = obj[key];
    // console.log(key, typeof value)
    if (value && value.constructor === Array) {
      dataArr.push({ key: uuidv4(), jsonkey: key, type: SwiftType.array })
    } else if (value && typeof value === 'object') {
      let type = key.toLowerCase();
      type = type.replace(type[0],type[0].toUpperCase());
      const newDataArr = handleJsonData(value);
      dataArr.push({ key: uuidv4(), jsonkey: key, type, children: newDataArr });
    } else {
      let type = SwiftType.string
      switch (typeof value) {
        case 'string':
          type = SwiftType.string
          break;
        case 'boolean':
          type = SwiftType.bool
          break;
        case 'number':
          let arr = value.toString().split('.')
          if (arr.length > 1) {
            type = SwiftType.float
          } else {
            type = SwiftType.int
          }
          break;
        default:
          continue;
      }
      dataArr.push({ key: uuidv4(), jsonkey: key, type });
    }
  }
  return dataArr;
}

export const transformJsonData = (json) => {
  return (dispatch) => {
    let obj = eval('(' + json + ')');
    let children = handleJsonData(obj);
    const dataArr = [{ key: uuidv4(), jsonkey: 'Root', type: 'Model', isRoot: true, children }]
    dispatch(newFinalJsonData(dataArr));
    console.log(dataArr);
  }
}