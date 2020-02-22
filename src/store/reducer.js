import { combineReducers } from 'redux-immutable';
import { reducer as editReducer } from '../components/edit/store';

const reducer = combineReducers({
  edit: editReducer
})

export default reducer;