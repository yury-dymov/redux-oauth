import Immutable                                      from 'immutable';
import { createReducer }                              from 'redux-immutablejs';

import { AUTHENTICATE_COMPLETE, AUTHENTICATE_ERROR }  from 'actions/authenticate';
import { OAUTH_SIGN_IN_COMPLETE }                     from 'actions/oauthSignIn';

import { SIGN_OUT }                                   from 'actions/signOut';

const initialState = Immutable.fromJS({
  attributes: null,
  isSignedIn: false
});

export default createReducer(initialState, {
  [AUTHENTICATE_COMPLETE]: (state, { user }) => state.mergeDeep({
    attributes: user,
    isSignedIn: true
  }),

  [OAUTH_SIGN_IN_COMPLETE]: (state, { user }) => state.mergeDeep({
    attributes: user,
    isSignedIn: true
  }),

  [AUTHENTICATE_ERROR]:   () => initialState,

  [SIGN_OUT]: () => initialState
});
