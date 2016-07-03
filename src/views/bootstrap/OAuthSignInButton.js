import React, { PropTypes, Component }  from 'react';
import { connect }                      from 'react-redux';

import ButtonLoader                     from './ButtonLoader';

import { oAuthSignIn }                  from 'actions/oauth-sign-in';

class OAuthSignInButton extends Component {
  static propTypes = {
    provider:     PropTypes.string.isRequired,
    label:        PropTypes.string,
    children:     PropTypes.node,
    icon:         PropTypes.node,
    dispatch:     PropTypes.func
  };

  static defaultProps = {
    children: <span>OAuth Sign In</span>,
    icon:     null
  };
  
  handleClick = () => {
    const { provider, dispatch } = this.props; 
    
    dispatch(oAuthSignIn({ provider }));
  };

  render() {
    const auth      = this.props.auth;
    const disabled  = auth.getIn(['user', 'isSignedIn']);
    const loading   = auth.getIn(['oAuthSignIn', this.props.provider, 'loading']);

    return (
      <ButtonLoader
        loading   = {loading}
        icon      = {this.props.icon}
        className = {`${this.props.className} oauth-sign-in-submit`}
        disabled  = {disabled}
        onClick   = {this.handleClick}
        {...this.props} 
      />
    );
  }
}

export default connect(({ auth }) => ({ auth }))(OAuthSignInButton);
