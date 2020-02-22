import { combineReducers } from 'redux-immutable';
import { reducer as editReducer } from '../components/edit/store';
import { reducer as formatReducer } from '../components/format/store';

const reducer = combineReducers({
  edit: editReducer,
  format: formatReducer
})

export default reducer;