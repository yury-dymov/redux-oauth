import Immutable                                        from 'immutable';
import { createReducer }                                from 'redux-immutablejs';

import { SS_AUTH_TOKEN_UPDATE, SS_AUTH_TOKEN_REPLACE }  from 'actions/server';

const initialState = Immutable.fromJS({ headers:  null });

export default createReducer(initialState, {
  [SS_AUTH_TOKEN_UPDATE]: (state, { headers }) => state.merge({ headers }),

  [SS_AUTH_TOKEN_REPLACE]: (state, { headers }) => state.merge({ headers })
});
