import Immutable          from 'immutable';
import { createReducer }  from 'redux-immutablejs';
import * as A             from 'actions/configure';

const initialState = Immutable.fromJS({
  loading:  true,
  errors:   null
});

export default createReducer(initialState, {
  [A.CONFIGURE_START]: state => state.set('loading', true)
});
