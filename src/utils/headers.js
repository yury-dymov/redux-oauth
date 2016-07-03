import { getTokenFormat } from './session-storage';
import keys               from 'lodash/keys';
import isArray            from 'lodash/isArray';

export function parseHeaders(headers) {
  if (!headers) {
    return;
  }

  const newHeaders  = {};
  const tokenFormat = getTokenFormat();
  let blankHeaders  = true;
  const isHeaders   = headers.constructor.name === 'Headers';

  keys(tokenFormat).forEach((key) => {
    newHeaders[key] = isHeaders ? headers.get(key) : headers[key];

    if (newHeaders[key]) {
      if (isArray(newHeaders[key])) {
        newHeaders[key] = newHeaders[key][0];
      }

      blankHeaders = false;
    }
  });

  if (!blankHeaders) {
    return newHeaders;
  }
}

export function areHeadersBlank(headers) {
  if (!headers) {
    return true;
  }

  const tokenFormat = getTokenFormat();
  const allKeys     = keys(tokenFormat);
  const isHeaders   = headers.constructor.name === 'Headers';


  for (let i = 0; i < allKeys.length; ++i) {
    const value = isHeaders ? headers.has([allKeys[i]]) : typeof headers[allKeys[i]] !== 'undefined';

    if (value) {
      return false;
    }
  }

  return true;
}
