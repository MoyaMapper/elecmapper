import { fromJS } from 'immutable';
import * as constants from './constants';

const defaultState = fromJS({
  showType: constants.showType.half,
  jsonDataArr: []
})

export default (state = defaultState, action) => {
  switch (action.type) {
    case constants.SWITCH_SHOW_TYPE:
      console.log(action.value)
      return state.set('showType', action.value);
    case constants.NEW_FINAL_JSON_DATA:
      return state.set('jsonDataArr', fromJS(action.value));
    default:
      return state;
  }
}