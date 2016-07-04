import originalFetch                    from 'isomorphic-fetch';
import assign                           from 'lodash/assign';
import keys                             from 'lodash/keys';

import { SAVED_CREDS_KEY }              from './constants';
import {
  getApiUrl,
  retrieveData,
  persistData,
  getCurrentSettings,
  getTokenFormat 
}                                       from './session-storage';
import { parseHeaders,areHeadersBlank } from './headers';
import { getAccessToken }               from './client-settings';

import { ssAuthTokenReplace }           from 'actions/server';


const isApiRequest = (url) => url.match(getApiUrl());

export function addAuthorizationHeader(accessToken, headers) {
  return assign({}, headers, { Authorization: `Bearer ${accessToken}` });
}

function getAuthHeaders(url) {
  if (isApiRequest(url)) {
    let currentHeaders = {};
    
    if (getCurrentSettings().isServer) {
      currentHeaders = getCurrentSettings().headers;
    } else {
      currentHeaders = retrieveData(SAVED_CREDS_KEY) || currentHeaders;
    }
    
    const nextHeaders = {};

    nextHeaders["If-Modified-Since"] = "Mon, 26 Jul 1997 05:00:00 GMT";

    keys(getTokenFormat()).forEach((key) => {
      const value = currentHeaders[key];

      if (typeof value !== 'undefined') {
        nextHeaders[key] = currentHeaders[key];
      }
    });

    if(!areHeadersBlank(currentHeaders)) {
      return addAuthorizationHeader(getAccessToken(currentHeaders), nextHeaders);
    }
  }
  
  return {};
}

function updateAuthCredentials(resp) {
  if (isApiRequest(resp.url)) {
    const oldHeaders = resp.headers;

    if (!areHeadersBlank(oldHeaders)) {
      const newHeaders = parseHeaders(oldHeaders);
      if (getCurrentSettings().isServer) {
        getCurrentSettings().headers = newHeaders;

        getCurrentSettings().dispatch(ssAuthTokenReplace({ headers: newHeaders }));
      } else {
        persistData(SAVED_CREDS_KEY, newHeaders);
      }
    }
  }

  return resp;
}

export default function(url, options={}) {
  if (!options.headers) {
    options.headers = {}
  }

  assign(options.headers, getAuthHeaders(url));

  return originalFetch(url, options)
    .then(resp => updateAuthCredentials(resp));
}
