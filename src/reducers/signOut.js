import Immutable                                       from 'immutable';
import { createReducer }                               from 'redux-immutablejs';
import { SIGN_OUT, SIGN_OUT_COMPLETE, SIGN_OUT_ERROR } from 'actions/signOut';

const initialState = Immutable.fromJS({
  loading: false,
  errors: null
});

export default createReducer(initialState, {
  [SIGN_OUT]: (state) => state.setIn([ 'loading' ], true),

  [SIGN_OUT_COMPLETE]: (state) => state.mergeDeep({ loading: false, errors: null }),

  [SIGN_OUT_ERROR]: (state, { errors }) => state.mergeDeep({ loading: false, errors })
});
