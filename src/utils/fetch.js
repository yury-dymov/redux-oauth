import originalFetch          from 'isomorphic-fetch';
import assign                 from 'lodash/assign';
import { updateHeaders }      from 'actions/headers';
import { getSettings }        from 'models/settings';

import {
  parseHeaders,
  getHeaders,
  prepareHeadersForFetch,
  areHeadersBlank
}                             from 'utils/headers';

export default function (url, options = {}) {
  return (dispatch, getState) => {
    const state                     = getState();
    const { tokenFormat, backend }  = getSettings(state);

    if (!url.match(backend.apiUrl)) {
      return originalFetch(url, options)
        .then(resp => Promise.resolve(resp))
        .catch(err => Promise.reject(err));
    }

    return originalFetch(url, assign({}, options, { headers: prepareHeadersForFetch(getHeaders(state), tokenFormat) }))
      .then((resp) => {
        const headers = parseHeaders(resp.headers, tokenFormat);

        if (!areHeadersBlank(headers, tokenFormat)) {
          dispatch(updateHeaders(headers));
        }

        return Promise.resolve(resp);
      })
      .catch(err => Promise.reject(err));
  };
}
