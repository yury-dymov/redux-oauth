import querystring        from 'querystring';
import assign             from 'lodash/assign';
import keys               from 'lodash/keys';

import { getTokenFormat } from './session-storage';

export function normalizeTokenKeys(params) {
  if (params.token) {
    params['access-token'] = params.token;
    delete params.token;
  }
  
  if (params.auth_token) {
    params['access-token'] = params.auth_token;
    delete params.auth_token;
  }
  
  if (params.client_id) {
    params.client = params.client_id;
    delete params.client_id;
  }
  
  return params;
};


const getAnchorSearch = (location) => {
  const rawAnchor = location.anchor || ''; 
  const arr       = rawAnchor.split('?');
  
  return arr.length > 1 ? arr[1] : null;
};


const getSearchQs = (location) => {
  const rawQs = location.search || '';
  const qs    = rawQs.replace('?', '');

  return qs ? querystring.parse(qs) : {};
};


const getAnchorQs = function(location) {
  const anchorQs    = getAnchorSearch(location);
  
  return (anchorQs) ? querystring.parse(anchorQs) : {};
};

const stripKeys = (obj, keys) => {
  for (const q in keys) {
    delete obj[keys[q]];
  }

  return obj;
};

export function getAllParams (location) {
  return assign({}, getAnchorQs(location), getSearchQs(location));
};


const buildCredentials = (location, keys) => {
  const params = getAllParams(location);
  const authHeaders = {};

  for (const key of keys) {
    authHeaders[key] = params[key];
  }

  return normalizeTokenKeys(authHeaders);
};


// this method is tricky. we want to reconstruct the current URL with the
// following conditions:
// 1. search contains none of the supplied keys
// 2. anchor search (i.e. `#/?key=val`) contains none of the supplied keys
// 3. all of the keys NOT supplied are presevered in their original form
// 4. url protocol, host, and path are preserved
const getLocationWithoutParams = (currentLocation, keys) => {
  let newSearch   = querystring.stringify(stripKeys(getSearchQs(currentLocation), keys));
  let newAnchorQs = querystring.stringify(stripKeys(getAnchorQs(currentLocation), keys));
  let newAnchor   = (currentLocation.hash || '').split('?')[0];

  if (newSearch) {
    newSearch = '?' + newSearch;
  }

  if (newAnchorQs) {
    newAnchor += '?' + newAnchorQs;
  }

  if (newAnchor && !newAnchor.match(/^#/)) {
    newAnchor = '#/' + newAnchor;
  }

  // reconstruct location with stripped auth keys
  return currentLocation.pathname + newSearch + newAnchor;
};


export default function getRedirectInfo(currentLocation) {
  if (!currentLocation) {
    return {};
  } else {
    const authKeys = keys(getTokenFormat());

    const authRedirectHeaders = buildCredentials(currentLocation, authKeys);
    const authRedirectPath    = getLocationWithoutParams(currentLocation, authKeys);

    if (authRedirectPath !== currentLocation) {
      return {authRedirectHeaders, authRedirectPath};
    } else {
      return {};
    }
  }
}
