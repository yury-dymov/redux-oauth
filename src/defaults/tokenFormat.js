export default {
  'access-token': '{{ auth_token }}',
  'token-type':   'Bearer',
  client:         '{{ client_id }}',
  expiry:         null,
  uid:            null,
  authorization:  '{{ token-type } { access-token }}'
};
