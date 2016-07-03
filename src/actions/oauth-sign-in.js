import * as C from '../utils/constants';
import { getAllParams, normalizeTokenKeys }     from '../utils/parse-url';
import { getOAuthUrl }                          from '../utils/session-storage';
import { getTokenValidationPath, persistData }  from '../utils/session-storage';
import { parseResponse }                        from '../utils/handle-fetch-response';
import fetch                                    from '../utils/fetch';
import openPopup                                from '../utils/popup';

export const OAUTH_SIGN_IN_START    = 'OAUTH_SIGN_IN_START';
export const OAUTH_SIGN_IN_COMPLETE = 'OAUTH_SIGN_IN_COMPLETE';
export const OAUTH_SIGN_IN_ERROR    = 'OAUTH_SIGN_IN_ERROR';

function listenForCredentials(popup, provider, resolve, reject) {
  if (!resolve) {
    return new Promise((resolve, reject) => {
      listenForCredentials(popup, provider, resolve, reject);
    });
  }

  let creds = null;

  try {
    creds = getAllParams(popup.location);
  } catch (err) {}

  if (creds && creds.uid) {
    popup.close();
    persistData(C.SAVED_CREDS_KEY, normalizeTokenKeys(creds));
    fetch(getTokenValidationPath())
      .then(parseResponse)
      .then(({data}) => resolve(data))
      .catch(({errors}) => reject({errors}));
  } else if (popup.closed) {
    reject({ errors: 'Authentication was cancelled.' })
  } else {
    setTimeout(() => listenForCredentials(popup, provider, resolve, reject), 0);
  }
}


function authenticate({ provider, url, tab = false}) {
  const name  = (tab) ? '_blank' : provider;
  const popup = openPopup(provider, url, name);

  return listenForCredentials(popup, provider);
}


export function oAuthSignInStart(provider) {
  return { type: OAUTH_SIGN_IN_START, provider };
}
export function oAuthSignInComplete(user) {
  return { type: OAUTH_SIGN_IN_COMPLETE, user };
}
export function oAuthSignInError(errors) {
  return { type: OAUTH_SIGN_IN_ERROR, errors };
}
export function oAuthSignIn({ provider, params }) {
  return dispatch => {
    dispatch(oAuthSignInStart(provider));

    const url = getOAuthUrl( {provider, params });

    return authenticate({ provider, url})
      .then(user => dispatch(oAuthSignInComplete(user)))
      .catch(({ errors }) => dispatch(oAuthSignInError(errors)));
  };
}
