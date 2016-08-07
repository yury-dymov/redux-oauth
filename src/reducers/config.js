import Immutable              from 'immutable';
import { createReducer }      from 'redux-immutablejs';
import { AUTH_INIT_SETTINGS } from 'actions/initialize';

const initialState = Immutable.fromJS({});

export default createReducer(initialState, {
  [AUTH_INIT_SETTINGS]: (state, { config }) => state.mergeDeep({ ...config })
});
