import Immutable                                                            from 'immutable';
import { createReducer }                                                    from 'redux-immutablejs';
import { OAUTH_SIGN_IN_START, OAUTH_SIGN_IN_COMPLETE, OAUTH_SIGN_IN_ERROR } from 'actions/oauthSignIn';
import { SIGN_OUT }                                                         from 'actions/signOut';

const initialState = Immutable.fromJS({
  loading:  false,
  errors:   null
});

export default createReducer(initialState, {
  [OAUTH_SIGN_IN_START]: (state, { provider }) => state.setIn([provider, 'loading'], true),

  [OAUTH_SIGN_IN_COMPLETE]: (state, { provider }) => state.mergeDeep({
    [provider]: {
      loading:  false,
      errors:   null
    }
  }),

  [OAUTH_SIGN_IN_ERROR]: (state, { provider, errors }) => state.mergeDeep({
    [provider]: {
      loading: false,
      errors
    }
  }),

  [SIGN_OUT]: () => initialState
});
