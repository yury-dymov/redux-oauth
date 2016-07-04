export const SS_AUTH_TOKEN_UPDATE   = 'SS_AUTH_TOKEN_UPDATE';
export const SS_AUTH_TOKEN_REPLACE  = 'SS_AUTH_TOKEN_REPLACE';

export function ssAuthTokenUpdate({user, headers }) {
  return { type: SS_AUTH_TOKEN_UPDATE, user, headers };
}

export function ssAuthTokenReplace({ headers }) {
  return { type: SS_AUTH_TOKEN_REPLACE, headers };
}
