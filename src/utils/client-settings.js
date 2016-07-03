import * as C from './constants';
import assign from 'lodash/assign';
import fetch  from './fetch';
import {
  getApiUrl,
  getCurrentSettings,
  setCurrentSettings,
  retrieveData,
  persistData,
  resetConfig
} from './session-storage';

export const defaultSettings = {
  storage:            'cookies',
  cookieExpiry:       14,
  cookiePath:         '/',
  initialCredentials: null,

  tokenFormat: {
    'access-token': '{{ access-token }}',
    'token-type':   'Bearer',
    client:         '{{ client }}',
    expiry:         '{{ expiry }}',
    uid:            '{{ uid }}'
  }
};

export function applyConfig({ settings = {}, reset = false } = {}) {
  if (reset) {
    resetConfig();
  }

  setCurrentSettings(assign({}, defaultSettings, settings));

  const savedCreds = retrieveData(C.SAVED_CREDS_KEY);

  if (getCurrentSettings().initialCredentials) {
    const { user, headers } = getCurrentSettings().initialCredentials;

    persistData(C.SAVED_CREDS_KEY, headers);

    return Promise.resolve(user);
  } else if (savedCreds) {
    return fetch(getApiUrl());
  }

  return Promise.reject({ reason: 'No credentials.' })
}
