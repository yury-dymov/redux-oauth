export const SS_AUTH_TOKEN_UPDATE         = 'SS_AUTH_TOKEN_UPDATE';

export function ssAuthTokenUpdate({user, headers }) {
  return { type: SS_AUTH_TOKEN_UPDATE, user, headers };
}
