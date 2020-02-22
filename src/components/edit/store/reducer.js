import { fromJS } from 'immutable';
import * as constants from './constants';

const defaultState = fromJS({
  showType: constants.showType.half
})

export default (state = defaultState, action) => {
  switch (action.type) {
    case constants.SWITCH_SHOW_TYPE:
      console.log(action.value)
      return state.set('showType', action.value);
    default:
      return state;
  }
}