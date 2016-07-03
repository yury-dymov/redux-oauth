import { getTokenFormat } from './session-storage';

export function parseHeaders(headers) {
  const newHeaders  = {};
  const tokenFormat = getTokenFormat();
  let blankHeaders  = true;

  for (const key of tokenFormat) {
    newHeaders[key] = headers[key];

    if (newHeaders[key]) {
      if (typeof newHeaders[key] === 'object') {
        newHeaders[key] = newHeaders[key][0];
      }

      blankHeaders = false;
    }
  }

  if (!blankHeaders) {
    return newHeaders;
  }

  return headers;
}

export function areHeadersBlank(headers) {
  if (!headers) {
    return true;
  }

  const tokenFormat = getTokenFormat();

  for (const key of tokenFormat) {
    if (headers[key]) {
      return false;
    }
  }

  return true;
}
