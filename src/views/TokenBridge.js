import React, { Component, PropTypes }  from 'react';
import { connect }                      from 'react-redux';

class TokenBridge extends Component {
  static propTypes = {
    initialCredentials: PropTypes.any
  };

  render () {
    return (
      <script
        id                      = 'token-bridge'
        type                    = 'application/json'
        dangerouslySetInnerHTML = {{__html: this.props.initialCredentials}}
      ></script>
    );
  }
}

export default connect(({ auth }) => {
  const headers             = auth.getIn(['server', 'headers']);
  const initialCredentials  = headers && JSON.stringify({
      user: auth.getIn(['server', 'user']),
      headers
    });

  return { initialCredentials };
})(TokenBridge);
