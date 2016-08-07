import { combineReducers }  from 'redux-immutablejs';
import Immutable            from "immutable";

import authentication       from './authenticate';
import user                 from './user';
import oAuthSignIn          from './oauthSignIn';
import headers              from './headers';
import signOut              from './signOut';
import config               from './config';

const reducer = combineReducers({
  signOut,
  authentication,
  oAuthSignIn,
  headers,
  user,
  config
});

export default (state = {}, action) => {
  if (!Immutable.Iterable.isIterable(state)) {
    return reducer(Immutable.fromJS(state), action);
  }

  return reducer(state, action);
}
