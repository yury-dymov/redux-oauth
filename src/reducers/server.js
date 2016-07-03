import Immutable                from "immutable";
import { createReducer }        from "redux-immutablejs";
import { SS_AUTH_TOKEN_UPDATE } from "actions/server";

const initialState = Immutable.fromJS({
  user:     null,
  headers:  null
});

export default createReducer(initialState, {
  [SS_AUTH_TOKEN_UPDATE]: (state, { user = null, headers = null }) => state.merge({user, headers})
});
