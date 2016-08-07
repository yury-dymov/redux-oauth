import Immutable                                      from 'immutable';
import { createReducer }                              from 'redux-immutablejs';
import { AUTHENTICATE_COMPLETE, AUTHENTICATE_ERROR }  from 'actions/authenticate';
import { SIGN_OUT }                                   from 'actions/signOut';

const initialState = Immutable.fromJS({
  loading:  false,
  valid:    false,
  errors:   null
});

export default createReducer(initialState, {
  [AUTHENTICATE_COMPLETE]: state => state.merge({
    loading:  false,
    errors:   null,
    valid:    true
  }),

  [AUTHENTICATE_ERROR]: state => state.merge({
    loading:  false,
    errors:   'Invalid token',
    valid:    false
  }),

  [SIGN_OUT]: () => initialState
});
