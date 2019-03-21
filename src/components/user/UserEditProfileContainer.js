import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { push } from 'react-router-redux';
import AppButton from '../common/AppButton';
import { updateProfile } from '../../actions/userActions';
import { updateFeedback } from '../../actions/appActions';
import UserDetailsForm from '../common/admin/users/UserDetailsForm';
import PageTitle from '../common/PageTitle';
import messages from '../../resources/messages';
import { emptyString } from '../../lib/formValidators';

const localMessages = {
  title: { id: 'user.editProfile.title', defaultMessage: 'Edit Profile' },
  feedback: { id: 'user.editProfile.feedback', defaultMessage: 'We updated your profile.' },
  failed: { id: 'user.editProfile.failed', defaultMessage: 'Sorry, for some reason that didn\'t work.  Please try again' },
};

const UserEditProfileContainer = ({ profile, handleSave, handleSubmit, pristine, submitting }) => (
  <Grid className="details user-details">
    <PageTitle value={localMessages.title} />
    <h1>
      <FormattedMessage {...localMessages.title} />
    </h1>
    <form className="app-form user-form" name="userForm" onSubmit={handleSubmit(handleSave.bind(this))}>
      <UserDetailsForm initialValues={profile} form="userForm" />
      <Row>
        <Col lg={12}>
          <AppButton
            type="submit"
            style={{ marginTop: 30 }}
            label={messages.save}
            disabled={pristine || submitting}
            primary
          />
        </Col>
      </Row>
    </form>
  </Grid>
);

UserEditProfileContainer.propTypes = {
  // from hoc chain
  intl: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  // from dispatch
  handleSave: PropTypes.func.isRequired,
  // from state
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  profile: state.user.profile,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSave: values => dispatch(updateProfile(values))
    .then((result) => {
      if (result.success) {
        // let them know it worked
        dispatch(updateFeedback({ classes: 'info-notice', open: true, message: ownProps.intl.formatMessage(localMessages.feedback) }));
        // back to home
        dispatch(push('user/profile'));
      } else {
        dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.failed) }));
      }
    }),
});

function validate(values) {
  const errors = {};
  if (emptyString(values.name)) {
    errors.name = localMessages.nameError;
  }
}

const reduxFormConfig = {
  form: 'userForm',
  validate,
};

export default
injectIntl(
  reduxForm(reduxFormConfig)(
    connect(mapStateToProps, mapDispatchToProps)(
      UserEditProfileContainer
    )
  )
);
