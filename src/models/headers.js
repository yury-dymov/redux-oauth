import { getSettings }  from './settings';
import keys             from 'lodash/keys';

export function getHeaders(state) {
  const { tokenFormat } = getSettings(state);
  const ret             = {};

  keys(tokenFormat).forEach(key => {
    const value = state.auth.getIn(['headers', key]);

    if (value) {
      ret[key] = value;
    }
  });

  return ret;
}
