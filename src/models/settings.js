export function getSettings(state) {
  return {
    backend:        getBackend(state),
    cookieOptions:  cookieOptions(state),
    tokenFormat:    getTokenFormat(state)
  };
}

function getBackend(state) {
  const apiUrl = `${state.auth.getIn(['config', 'backend', 'apiUrl'])}`;
  const authProviderPaths = {};

  state.auth.getIn(['config', 'backend', 'authProviderPaths'])
    .forEach((path, key) => authProviderPaths[key] = `${apiUrl}${path}`);

  const signOutPart = state.auth.getIn(['config', 'backend', 'signOutPath']);

  const signOutPath = signOutPart ? `${apiUrl}${signOutPart}` : null;

  return {
    tokenValidationPath: `${apiUrl}${state.auth.getIn(['config', 'backend', 'tokenValidationPath'])}`,
    signOutPath,
    authProviderPaths,
    apiUrl
  };
}

function cookieOptions(state) {
  return {
    key:    state.auth.getIn(['config', 'cookieOptions', 'key']),
    expire: state.auth.getIn(['config', 'cookieOptions', 'expire']),
    path:   state.auth.getIn(['config', 'cookieOptions', 'path'])
  };
}

function getTokenFormat(state) {
  const ret = {};

  state.auth.getIn(['config', 'tokenFormat']).forEach((value, key) => ret[key] = value);

  return ret;
}
