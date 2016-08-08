import { getSettings }                    from 'models/settings';
import parseResponse                      from 'utils/parseResponse';
import { areHeadersBlank }                from 'utils/headers';
import { updateHeaders }                  from './headers';
import fetch                              from 'utils/fetch';
import openPopup                          from 'utils/popup';
import { buildCredentials, getAllParams } from 'utils/getRedirectInfo';

import keys                               from 'lodash/keys';

export const OAUTH_SIGN_IN_START    = 'OAUTH_SIGN_IN_START';
export const OAUTH_SIGN_IN_COMPLETE = 'OAUTH_SIGN_IN_COMPLETE';
export const OAUTH_SIGN_IN_ERROR    = 'OAUTH_SIGN_IN_ERROR';

export function oAuthSignInStart(provider) {
  return { type: OAUTH_SIGN_IN_START, provider };
}

export function oAuthSignInComplete({ user, provider }) {
  return { type: OAUTH_SIGN_IN_COMPLETE, user, provider };
}

export function oAuthSignInError(provider, errors) {
  return { type: OAUTH_SIGN_IN_ERROR, provider, errors };
}

export function oAuthSignIn({ provider, params }) {
  return (dispatch, getState) => {
    dispatch(oAuthSignInStart(provider));

    const state = getState();
    const url   = getOAuthUrl({ provider, params, state });

    return dispatch(authenticate({ provider, url, state }))
      .then(user => dispatch(oAuthSignInComplete({ user, provider })))
      .catch(({ errors }) => dispatch(oAuthSignInError(provider, errors)));
  };
}

function getOAuthUrl({ provider, params, state }) {
  const { authProviderPaths } = getSettings(state).backend;
  const providerPath = authProviderPaths[provider];

  if (!providerPath) {
    throw `authProviderPath is not set for ${provider}`;
  }

  let oAuthUrl = `${providerPath}?auth_origin_url=${encodeURIComponent(window.location.href)}`;

  if (params) {
    keys(params).forEach(key => oAuthUrl += `&${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  }

  return oAuthUrl;
}

function authenticate({ provider, url, state, tab = false }) {
  const name = (tab) ? '_blank' : provider;
  const popup = openPopup(provider, url, name);

  return (dispatch, getState) => {
    const { tokenFormat } = getSettings(getState());

    return new Promise((resolve, reject) =>
      dispatch(listenForCredentials({ popup, provider, state, resolve, reject, tokenFormat })));
  };
}

function listenForCredentials({ popup, provider, state, resolve, reject, tokenFormat }) {
  return dispatch => {
    let creds = null;

    try {
      creds = getAllParams(popup.location, tokenFormat);
    } catch (err) {}

    if (!areHeadersBlank(creds, tokenFormat)) {
      const { tokenValidationPath } = getSettings(state).backend;

      dispatch(updateHeaders(buildCredentials(popup.location, tokenFormat)));

      popup.close();

      return dispatch(fetch(tokenValidationPath))
        .then(parseResponse)
        .then(({ data }) => resolve(data))
        .catch(({ errors }) => reject({ errors }));
    } else if (popup.closed) {
      return reject({ errors: 'Authentication was cancelled.' });
    }

    return setTimeout(() => dispatch(listenForCredentials({ popup, provider, state, resolve, reject, tokenFormat })), 20);
  };
}
