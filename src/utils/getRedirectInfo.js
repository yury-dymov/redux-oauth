import querystring        from 'querystring';
import assign             from 'lodash/assign';
import keys               from 'lodash/keys';
import omit               from 'lodash/omit';
import isNull             from 'lodash/isNull';

import { evalHeader }     from './headers';

function getAnchorSearch(location) {
  const rawAnchor = location.anchor || '';
  const arr       = rawAnchor.split('?');

  return arr.length > 1 ? arr[1] : null;
}


function getSearchQs(location) {
  const rawQs = location.search || '';
  const qs    = rawQs.replace('?', '');

  return qs ? querystring.parse(qs) : {};
}

function getAnchorQs(location) {
  const anchorQs    = getAnchorSearch(location);

  return (anchorQs) ? querystring.parse(anchorQs) : {};
}

export function getAllParams(location) {
  return assign({}, getAnchorQs(location), getSearchQs(location));
}


export function buildCredentials(location, tokenFormat) {
  const params = getAllParams(location);
  const authHeaders = {};

  keys(tokenFormat).forEach((key) => {
    if (params[key]) {
      authHeaders[key] = params[key];
    } else {
      const computedHeader = evalHeader(tokenFormat[key], params);

      if (!isNull(computedHeader)) {
        authHeaders[key] = computedHeader;
      }
    }
  });

  return authHeaders;
}


// this method is tricky. we want to reconstruct the current URL with the
// following conditions:
// 1. search contains none of the supplied keys
// 2. anchor search (i.e. `#/?key=val`) contains none of the supplied keys
// 3. all of the keys NOT supplied are presevered in their original form
// 4. url protocol, host, and path are preserved
function getLocationWithoutParams(currentLocation, keyz) {
  let newSearch     = querystring.stringify(omit(getSearchQs(currentLocation), keyz));
  const newAnchorQs = querystring.stringify(omit(getAnchorQs(currentLocation), keyz));
  let newAnchor     = (currentLocation.hash || '').split('?')[0];

  if (newSearch) {
    newSearch = `?${newSearch}`;
  }

  if (newAnchorQs) {
    newAnchor += `?${newAnchorQs}`;
  }

  if (newAnchor && !newAnchor.match(/^#/)) {
    newAnchor = `#/${newAnchor}`;
  }

  return currentLocation.pathname + newSearch + newAnchor;
}


export default function (currentLocation, tokenFormat) {
  if (!currentLocation) {
    return {};
  }

  const authRedirectHeaders = buildCredentials(currentLocation, tokenFormat);
  const authRedirectPath    = getLocationWithoutParams(currentLocation, keys(tokenFormat));

  if (authRedirectPath !== currentLocation) {
    return { authRedirectHeaders, authRedirectPath };
  }

  return {};
}
