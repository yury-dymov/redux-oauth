import verifyAuth                                   from './verifyAuth';
import { authenticateComplete, authenticateError }  from './authenticate';
import { updateHeaders }                            from './headers';
import backend                                      from 'defaults/backend';
import tokenFormat                                  from 'defaults/tokenFormat';
import cookieOptions                                from 'defaults/cookieOptions';

import merge                                        from 'lodash/merge';
import keys                                         from 'lodash/keys';

export const AUTH_INIT_SETTINGS = 'AUTH_INIT_SETTINGS';

function initSettings(config) {
  return { type: AUTH_INIT_SETTINGS, config };
}

function preprocessTokenFormat(tf) {
  if (!tf || tf === undefined) {
    return null;
  }

  const ret = {};

  keys(tf).forEach(k => ret[k.toLowerCase()] = tf[k]);

  return ret;
}

function mergeSettings(settings) {
  return  {
    backend:        merge({}, backend, settings.backend),
    tokenFormat:    preprocessTokenFormat(settings.tokenFormat) || tokenFormat,
    cookieOptions:  merge({}, cookieOptions, settings.cookieOptions),
    cookies:        settings.cookies
  };
}

export function initialize(settings = {}) {
  return (dispatch, getState) => {
    if (getState().auth.getIn(['user', 'isSignedIn'])) {
      return Promise.resolve();
    }

    const mergedSettings = mergeSettings(settings);

    dispatch(initSettings(mergedSettings));

    if (mergedSettings.cookies && mergedSettings.cookies[mergedSettings.cookieOptions.key]) {
      try {
        dispatch(updateHeaders(JSON.parse(mergedSettings.cookies[mergedSettings.cookieOptions.key])));
      } catch (ex) {
        dispatch(updateHeaders());
      }
    }

    if (settings.currentLocation && settings.currentLocation.match(/blank=true/)) {
      return Promise.resolve({ blank: true });
    }

    return dispatch(verifyAuth(settings.currentLocation))
      .then(({ user }) => {
        dispatch(authenticateComplete(user));

        return Promise.resolve();
      })
      .catch(({ errors }) => {
        dispatch(updateHeaders());
        dispatch(authenticateError(errors));

        return Promise.resolve();
      });
  };
}
