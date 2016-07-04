import assign                                                         from 'lodash/assign';
import { authenticateStart, authenticateComplete, authenticateError } from './authenticate';
import { ssAuthTokenUpdate }                                          from './server';

import { applyConfig, initSettings }                                  from 'utils/client-settings';
import { destroySession, setCurrentSettings }                         from 'utils/session-storage';
import verifyAuth                                                     from 'utils/verify-auth';
import getRedirectInfo                                                from 'utils/parse-url';
import { areHeadersBlank }                                            from 'utils/headers';

import { push }                                                       from 'react-router-redux';

export function configure(settings = {}) {
  return dispatch => {
    if (settings.currentLocation && settings.currentLocation.match(/blank=true/)) {
      return Promise.resolve({ blank: true });
    }

    dispatch(authenticateStart());

    let promise;

    if (settings.isServer) {
      initSettings(assign({}, settings, { dispatch }));

      promise = verifyAuth(settings)
        .then(({ user, headers }) => {
          dispatch(ssAuthTokenUpdate({ headers, user }));

          return user;
        })
        .catch(({ reason }) => {
          dispatch(ssAuthTokenUpdate());

          return Promise.reject({ reason });
        });
    } else {
      settings = initSettings(settings);

      const initialState  = window[settings.reduxInitialState];
      const { headers }   = initialState.auth.server;
      const user          = initialState.auth.user.attributes;

      if (user && headers) {
        dispatch(authenticateComplete(user));

        settings.initialCredentials = { user, headers };

        dispatch(ssAuthTokenUpdate({ user, headers }));
      }

      const { authRedirectPath, authRedirectHeaders } = getRedirectInfo(window.location);

      if (authRedirectPath) {
        dispatch(push({ pathname: authRedirectPath }));
      }

      if (!areHeadersBlank(authRedirectHeaders)) {
        settings.initialCredentials = assign({}, settings.initialCredentials, authRedirectHeaders);
      }

      const serverSideRendering = typeof settings.serverSideRendering === 'undefined' || settings.serverSideRendering;

      if (serverSideRendering && !settings.initialCredentials || settings.cleanSession) {
        destroySession();
      }

      promise = Promise.resolve(applyConfig({ settings }));
    }

    return promise
      .then(user => {
        dispatch(authenticateComplete(user));
        return user;
      })
      .catch(({ reason } = {}) => {
        dispatch(authenticateError([reason]));

        return Promise.resolve({ reason });
      });
  };
}
