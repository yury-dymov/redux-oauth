import originalFetch                    from 'isomorphic-fetch';
import assign                           from 'lodash/assign';

import { SAVED_CREDS_KEY}               from './constants';
import {
  getApiUrl,
  retrieveData,
  persistData,
  getTokenFormat 
}                                       from './session-storage';
import { parseHeaders,areHeadersBlank } from './headers'

const isApiRequest = (url) => url.match(getApiUrl());

export function addAuthorizationHeader(accessToken, headers) {
  return assign({}, headers, { Authorization: `Bearer ${accessToken}` });
}

function getAuthHeaders(url) {
  if (isApiRequest(url)) {
    const currentHeaders = retrieveData(SAVED_CREDS_KEY) || {};
    const nextHeaders    = {};

    nextHeaders["If-Modified-Since"] = "Mon, 26 Jul 1997 05:00:00 GMT";

    for (const key in getTokenFormat()) {
      nextHeaders[key] = currentHeaders[key];
    }

    return addAuthorizationHeader(currentHeaders['access-token'], nextHeaders);
  } else {
    return {};
  }
}

function updateAuthCredentials(resp) {
  if (isApiRequest(resp.url)) {
    const oldHeaders = resp.headers;

    if (!areHeadersBlank(oldHeaders)) {
      const newHeaders = parseHeaders(oldHeaders);

      persistData(C.SAVED_CREDS_KEY, newHeaders);
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
