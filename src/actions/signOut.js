import fetch               from 'utils/fetch';

import { getSettings }     from 'models/settings';
import parseResponse       from 'utils/parseResponse';
import { updateHeaders }   from 'actions/headers';

export const SIGN_OUT = 'SIGN_OUT';
export const SIGN_OUT_COMPLETE = 'SIGN_OUT_COMPLETE';
export const SIGN_OUT_ERROR = 'SIGN_OUT_ERROR';

function signOutStart() {
  return { type: SIGN_OUT };
}

function signOutComplete() {
  return { type: SIGN_OUT_COMPLETE };
}

function signOutError(errors) {
  return { type: SIGN_OUT_ERROR, errors };
}

export function signOut() {
  return (dispatch, getState) => {
    const { backend } = getSettings(getState());

    dispatch(signOutStart());
    dispatch(updateHeaders({}));

    return dispatch(fetch(backend.signOutPath, { method: 'delete' }))
      .then(parseResponse)
      .then(() => {
        dispatch(signOutComplete());

        return Promise.resolve();
      })
      .catch((er) => {
        dispatch(signOutError(er));

        return Promise.reject(er);
      });
  };
}
