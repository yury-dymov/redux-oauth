import assign                         from 'lodash/assign';
import keys                           from 'lodash/keys';
import isArray                        from 'lodash/isArray';

import Cookies                        from 'js-cookie';

import { getHeaders as _getHeaders }  from 'models/headers';
import { getSettings }                from 'models/settings';

export function evalHeader(expression, headers) {
  try {
    const preprocessed = expression.trim();

    if (preprocessed.length > 1 && preprocessed[0] === '{' && preprocessed[preprocessed.length - 1] === '}') {
      let ret = null;

      try {
        ret = preprocessed.substr(1, preprocessed.length - 2).replace(/\{(.*?)}/g, (...m) => {
          const header = headers[m[1].trim().toLowerCase()];

          if (!header) {
            throw 'not found';
          }

          return header;
        });
      } catch (ex) {
        return null;
      }

      return ret;
    }

    return expression;
  } catch (ex) {
    return null;
  }
}

export function prepareHeadersForFetch(headers, tokenFormat) {
  const fetchHeaders  = assign({}, headers, { 'If-Modified-Since': 'Mon, 26 Jul 1997 05:00:00 GMT' });

  keys(tokenFormat).forEach(key => {
    const defaultValue = tokenFormat[key];

    if (defaultValue && !fetchHeaders[key]) {
      const evaluatedHeader = evalHeader(defaultValue, headers);

      if (evaluatedHeader) {
        fetchHeaders[key] = evaluatedHeader;
      }
    }
  });

  return fetchHeaders;
/*
  if (header['access-token']) {
    return assign({}, header, { Authorization: `Bearer ${header['access-token']}` });
  }

  return header;
  */
}

export function getHeaders(state) {
  if (!state || state === undefined) {
    return {};
  }

  const { cookieOptions, tokenFormat }  = getSettings(state);
  const ret                             = _getHeaders(state);

  if (!areHeadersBlank(ret, tokenFormat)) {
    return ret;
  }

  try {
    return JSON.parse(Cookies.get(cookieOptions.key) || '{}');
  } catch (ex) {
    return {};
  }
}

export function parseHeaders(headers, tokenFormat) {
  if (!headers) {
    return {};
  }

  const newHeaders  = {};

  let blankHeaders  = true;

  keys(tokenFormat).forEach((key) => {
    if (headers[key] === undefined) {
      if (headers.get && headers.get(key)) {
        newHeaders[key] = headers.get(key);
      }
    } else {
      newHeaders[key] = headers[key];
    }

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

  return {};
}

export function areHeadersBlank(headers, tokenFormat) {
  if (!headers) {
    return true;
  }

  const allKeys = keys(tokenFormat);

  for (let i = 0; i < allKeys.length; ++i) {
    const key = allKeys[i];

    let value;

    if (headers[key] === undefined) {
      if (headers.has && headers.has(key)) {
        value = headers.get(key);
      } else {
        continue;
      }
    } else {
      value = headers[key];
    }

    if (value && value.toLowerCase() !== (tokenFormat[key] || '').toLocaleLowerCase()) {
      return false;
    }
  }

  return true;
}
