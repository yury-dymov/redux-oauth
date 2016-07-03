import React, { PropTypes, Component }  from 'react';

import ButtonLoader                     from './ButtonLoader';

import { connect }                      from 'react-redux';
import { signOut }                      from 'actions/sign-out';

class SignOutButton extends Component {
  static propTypes = {
    children: PropTypes.node,
    icon:     PropTypes.node,
    dispatch: PropTypes.func
  };

  static defaultProps = {
    children: <span>Sign Out</span>,
    icon:     null
  };

  handleClick = () => {
    this.props.dispatch(signOut());
  };

  render() {
    const auth     = this.props.auth;
    const disabled = !auth.getIn(['user', 'isSignedIn']);
    const loading  = auth.getIn(['signOut', 'loading']);

    return (
      <ButtonLoader
        loading   = {loading}
        icon      = {this.props.icon}
        disabled  = {disabled}
        className = 'sign-out-submit'
        onClick   = {this.handleClick}
        {...this.props}
      />
    );
  }
}

export default connect(({ auth }) => ({ auth }))(SignOutButton);
