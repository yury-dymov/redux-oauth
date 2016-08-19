import Immutable                              from 'immutable';
import { createReducer }                      from 'redux-immutablejs';

import { UPDATE_HEADERS }                     from 'actions/headers';

import { SIGN_OUT }                           from 'actions/signOut';

const initialState = Immutable.fromJS({});

export default createReducer(initialState, {
  [UPDATE_HEADERS]: (state, { headers }) => state.mergeDeep(headers),

  [SIGN_OUT]: () => initialState
});
