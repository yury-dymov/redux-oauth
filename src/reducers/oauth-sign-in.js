import Immutable          from 'immutable';
import { createReducer }  from 'redux-immutablejs';
import * as A             from '../actions/oauth-sign-in';

const initialState = Immutable.fromJS({
  loading:  false,
  errors:   null
});

export default createReducer(initialState, {
  [A.OAUTH_SIGN_IN_START]: (state, { provider }) => state.setIn([provider, 'loading'], true),

  [A.OAUTH_SIGN_IN_COMPLETE]: (state, { provider }) => state.mergeDeep({
    [provider]: {
      loading:  false,
      errors:   null
    }
  }),

  [A.OAUTH_SIGN_IN_ERROR]: (state, { provider, errors }) => state.mergeDeep({
    [provider]: {
      loading: false,
      errors
    }
  })
});
