import authentication                         from './reducers/authenticate';
import configure                              from './reducers/configure';
import user                                   from './reducers/user';
import oAuthSignIn                            from './reducers/oauth-sign-in';
import server                                 from './reducers/server';
import signOut                                from './reducers/sign-out';
import { combineReducers }                    from 'redux-immutablejs';
import verifyAuth                             from './utils/verify-auth';

export { SignOutButton,  OAuthSignInButton }  from './views/bootstrap';

const authStateReducer = combineReducers({
  configure,
  signOut,
  authentication,
  oAuthSignIn,
  server,
  user
});

export { configure }                          from './actions/configure';
export { signOut }                            from './actions/sign-out';
export { oAuthSignIn }                        from './actions/oauth-sign-in';
export { getApiUrl }                          from './utils/session-storage';

export { verifyAuth, authStateReducer };

export { default as fetch }                   from './utils/fetch';

export {
  AUTHENTICATE_START,
  AUTHENTICATE_COMPLETE,
  AUTHENTICATE_ERROR
}                                             from './actions/authenticate';

export {
  OAUTH_SIGN_IN_START,
  OAUTH_SIGN_IN_COMPLETE,
  OAUTH_SIGN_IN_ERROR
}                                             from './actions/oauth-sign-in';

export {
  SS_AUTH_TOKEN_UPDATE,
  SS_AUTH_TOKEN_REPLACE
}                                             from './actions/server';

export {
  SIGN_OUT_START,
  SIGN_OUT_COMPLETE,
  SIGN_OUT_ERROR
}                                             from './actions/sign-out';
