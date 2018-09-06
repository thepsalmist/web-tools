import PropTypes from 'prop-types';
import React from 'react';
import { Grid } from 'react-flexbox-grid/lib';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { changePassword } from '../../actions/userActions';
import ChangePasswordForm from './ChangePasswordForm';
import messages from '../../resources/messages';

const ChangePasswordContainer = (props) => {
  const { handlePasswordChange } = props;
  return (
    <Grid>
      <ChangePasswordForm
        titleMsg={messages.userChangePassword}
        buttonMsg={messages.userChangePassword}
        showOldPassword
        onSubmit={handlePasswordChange}
      />
    </Grid>
  );
};

ChangePasswordContainer.propTypes = {
  // from dispatch
  handlePasswordChange: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  handlePasswordChange: values => dispatch(changePassword(values))
    .then((response) => {
      if (response.success === 1) {
        dispatch(push('/user/change-password-success'));
      }
      // errors handled by generic handler with message from server
    }),
});

export default connect(null, mapDispatchToProps)(ChangePasswordContainer);
