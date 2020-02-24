import { fromJS } from 'immutable';
import * as constants from './constants';

const defaultState = fromJS({
  showType: constants.showType.half,
  jsonDataArr: []
})

const updateJsonData = (state, action) => {
  return state.set('jsonDataArr', fromJS(action.value));
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case constants.SWITCH_SHOW_TYPE:
      console.log(action.value)
      return state.set('showType', action.value);
    case constants.NEW_JSON_DATA:
    case constants.UPDATE_JSON_DATA:
      return updateJsonData(state, action);
    default:
      return state;
  }
}