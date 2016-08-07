import { combineReducers }  from 'redux-immutablejs';

import authentication       from './authenticate';
import user                 from './user';
import oAuthSignIn          from './oauthSignIn';
import headers              from './headers';
import signOut              from './signOut';
import config               from './config';

export default combineReducers({
  signOut,
  authentication,
  oAuthSignIn,
  headers,
  user,
  config
});
