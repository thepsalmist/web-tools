import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { push } from 'react-router-redux';
import UserConsentForm from './UserConsentForm';
import withIntlForm from '../common/hocs/IntlForm';

import { updateProfile } from '../../actions/userActions';

const UserConsentContainer = props => <UserConsentForm onSubmit={args => props.handleUserConsent(args, props.user)} />;

UserConsentContainer.propTypes = {
  // from composition
  intl: PropTypes.object.isRequired,
  location: PropTypes.object,
  // from state
  user: PropTypes.object,
  // from dispatch
  handleUserConsent: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.user.profile,
});

const mapDispatchToProps = dispatch => ({
  handleUserConsent: (values, user) => {
    dispatch(updateProfile({ ...user, ...values }))
      .then((response) => { // go to home page
        if (response.success === 1) {
          dispatch(push('/user/'));
        }
      });
  },
});

export default
injectIntl(
  withIntlForm(
    connect(mapStateToProps, mapDispatchToProps)(
      UserConsentContainer
    )
  )
);
