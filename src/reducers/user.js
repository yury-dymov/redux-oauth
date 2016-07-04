import Immutable                                        from 'immutable';
import { createReducer }                                from 'redux-immutablejs';

import { SIGN_OUT_COMPLETE, SIGN_OUT_ERROR }            from 'actions/sign-out';
import { OAUTH_SIGN_IN_COMPLETE }                       from 'actions/oauth-sign-in';
import { AUTHENTICATE_COMPLETE, AUTHENTICATE_FAILURE }  from 'actions/authenticate';
import { SS_AUTH_TOKEN_UPDATE}                          from 'actions/server';

const initialState = Immutable.fromJS({
  attributes: null,
  isSignedIn: false
});

export default createReducer(initialState, {
  [AUTHENTICATE_COMPLETE]: (state, { user }) => state.merge({
    attributes: user,
    isSignedIn: true
  }),

  [OAUTH_SIGN_IN_COMPLETE]: (state, { user }) => state.merge({
    attributes: user,
    isSignedIn: true
  }),

  [SS_AUTH_TOKEN_UPDATE]: (state, { user }) => {
    return state.merge({
      isSignedIn: !!user,
      attributes: user
    });
  },

  [AUTHENTICATE_FAILURE]:    state => state.merge(initialState),

  [SIGN_OUT_COMPLETE]:                   state => state.merge(initialState),
  [SIGN_OUT_ERROR]:                      state => state.merge(initialState)
});
