import { SAVED_CREDS_KEY }  from './constants';
import assign               from 'lodash/assign';
import fetch                from './fetch';
import {
  getApiUrl,
  getCurrentSettings,
  setCurrentSettings,
  retrieveData,
  persistData
}                           from './session-storage';

export const defaultSettings = {
  storage:            'cookies',
  cookieExpiry:       14,
  cookiePath:         '/',
  initialCredentials: null,
  reduxInitialState:  '__INITIAL_STATE__',

  tokenFormat: {
    'access-token': '{{ access-token }}',
    'token-type':   'Bearer',
    client:         '{{ client }}',
    expiry:         '{{ expiry }}',
    uid:            '{{ uid }}'
  }
};

export function initSettings(settings) {
  const mergedSettings = assign({}, defaultSettings, settings);

  setCurrentSettings(mergedSettings);

  return mergedSettings;
}

export function applyConfig({ settings = {} }) {
  initSettings(settings);

  const savedCreds = retrieveData(SAVED_CREDS_KEY);

  if (getCurrentSettings().initialCredentials) {
    const { user, headers } = getCurrentSettings().initialCredentials;

    persistData(SAVED_CREDS_KEY, headers);

    return Promise.resolve(user);
  } else if (savedCreds) {
    return fetch(getApiUrl());
  }

  return Promise.reject({ reason: 'No credentials.' })
}

export function getAccessToken(headers) {
  if (headers.get && typeof headers.get === 'function') {
    return headers.get('access-token');
  }

  return headers['access-token'];
}
