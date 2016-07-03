export const SS_AUTH_TOKEN_UPDATE         = 'SS_AUTH_TOKEN_UPDATE';
export const SS_TOKEN_VALIDATION_COMPLETE = 'SS_TOKEN_VALIDATION_COMPLETE';
export const SS_TOKEN_VALIDATION_ERROR    = 'SS_TOKEN_VALIDATION_ERROR';

export function ssAuthTokenUpdate({user, headers }) {
  return { type: SS_AUTH_TOKEN_UPDATE, user, headers };
}
