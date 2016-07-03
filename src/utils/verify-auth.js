import fetch                                  from 'isomorphic-fetch';
import cookie                                 from 'cookie';
import url                                    from 'url';

import getRedirectInfo                        from './parse-url';
import { addAuthorizationHeader }             from './fetch';
import { parseHeaders,areHeadersBlank }       from './headers'
import { getApiUrl, getTokenValidationPath }  from './session-storage';

export function fetchToken({ cookies, currentLocation, apiUrl, tokenValidationPath } ) {
  const { authRedirectHeaders } = getRedirectInfo(url.parse(currentLocation));

  return new Promise((resolve, reject) => {
    if (cookies || authRedirectHeaders) {
      const rawCookies    = cookie.parse(cookies || '{}');
      const parsedCookies = JSON.parse(rawCookies.authHeaders || 'false');

      let headers;

      if (!areHeadersBlank(authRedirectHeaders)) {
        headers            = parseHeaders(authRedirectHeaders);
      } else if (rawCookies && parsedCookies) {
        headers            = parsedCookies;
      }

      if (!headers) {
        return reject({ reason: 'No creds' });
      }

      const resolvedApiUrl    = apiUrl ? apiUrl : getApiUrl();
      const resolvedTokenUrl  = tokenValidationPath ? tokenValidationPath : getTokenValidationPath();

      const validationUrl = `${resolvedApiUrl}${resolvedTokenUrl}?unbatch=true`;

      let newHeaders;

      return fetch(validationUrl, {
        headers: addAuthorizationHeader(headers['access-token'], headers)
      }).then((resp) => {
        newHeaders = parseHeaders(resp.headers);

        return resp.json();
      }).then((json) => {
        if (json.success) {
          return resolve({ headers:  newHeaders, user: json.data });
        } else {
          return reject({ reason: json.errors });
        }
      }).catch(reason => reject({ reason }));
    } else {
      return reject({ reason: 'No creds' });
    }
  });
}

const verifyAuth = ({ isServer, cookies, currentLocation, apiUrl, tokenValidationPath }) => new Promise((resolve, reject) => {
  if (isServer) {
    return fetchToken({ cookies, currentLocation, apiUrl, tokenValidationPath })
      .then(res => resolve(res))
      .catch(res => reject(res));
  }
  // TODO: deal with localStorage
  //Auth.validateToken(getCurrentEndpointKey())
  //.then((user) => resolve(user.data), (err) => reject({reason: err}));
});

export default verifyAuth;
