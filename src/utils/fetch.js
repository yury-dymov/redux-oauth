import originalFetch                    from 'isomorphic-fetch';
import assign                           from 'lodash/assign';

import { SAVED_CREDS_KEY }              from './constants';
import {
  getApiUrl,
  retrieveData,
  persistData,
  getTokenFormat 
}                                       from './session-storage';
import { parseHeaders,areHeadersBlank } from './headers'

import keys                             from 'lodash/keys';

const isApiRequest = (url) => url.match(getApiUrl());

export function addAuthorizationHeader(accessToken, headers) {
  return assign({}, headers, { Authorization: `Bearer ${accessToken}` });
}

function getAuthHeaders(url) {
  if (isApiRequest(url)) {
    // to make isomorphic: retrieve from currentSettings

    const currentHeaders = retrieveData(SAVED_CREDS_KEY) || {};
    const nextHeaders    = {};

    nextHeaders["If-Modified-Since"] = "Mon, 26 Jul 1997 05:00:00 GMT";

    keys(getTokenFormat()).forEach((key) => {
      const value = currentHeaders[key];

      if (typeof value !== 'undefined') {
        nextHeaders[key] = currentHeaders[key];
      }
    });

    return addAuthorizationHeader(currentHeaders['access-token'], nextHeaders);
  } else {
    return {};
  }
}

function updateAuthCredentials(resp) {
  // to make isomorphic pass dispatch here somehow and ssupdate

  if (isApiRequest(resp.url)) {
    const oldHeaders = resp.headers;

    if (!areHeadersBlank(oldHeaders)) {
      const newHeaders = parseHeaders(oldHeaders);

      persistData(SAVED_CREDS_KEY, newHeaders);
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
