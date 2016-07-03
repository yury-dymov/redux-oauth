import assign                                                         from 'lodash/assign';
import { authenticateStart, authenticateComplete, authenticateError } from './authenticate';
import { ssAuthTokenUpdate }                                          from './server';

import { applyConfig }                                                from 'utils/client-settings';
import { destroySession }                                             from 'utils/session-storage';
import verifyAuth                                                     from 'utils/verify-auth';
import getRedirectInfo                                                from 'utils/parse-url';

import { push }                                                       from 'react-router-redux';

export function configure(settings={}) {
  return dispatch => {
    if (settings.currentLocation && settings.currentLocation.match(/blank=true/)) {
      return Promise.resolve({ blank: true });
    }

    dispatch(authenticateStart());

    let promise;

    if (settings.isServer) {
      promise = verifyAuth(settings)
        .then(({ user, headers }) => {
          dispatch(ssAuthTokenUpdate({ headers, user }));

          return user;
        })
        .catch(({ reason }) => {
          dispatch(ssAuthTokenUpdate());

          return Promise.reject({reason});
        });
    } else {
      const tokenBridge = document.getElementById('token-bridge');

      if (tokenBridge) {
        const rawServerCreds = tokenBridge.innerHTML;
        if (rawServerCreds) {
          const serverCreds = JSON.parse(rawServerCreds);

          const { headers, user } = serverCreds;

          if (user) {
            dispatch(authenticateComplete(user));
            settings.initialCredentials = serverCreds;
          }

          dispatch(ssAuthTokenUpdate({ user, headers }));
        }
      }

      let {authRedirectPath, authRedirectHeaders} = getRedirectInfo(window.location);

      if (authRedirectPath) {
        dispatch(push({ pathname: authRedirectPath }));
      }

      if (authRedirectHeaders && authRedirectHeaders.uid && authRedirectHeaders['access-token']) {
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
