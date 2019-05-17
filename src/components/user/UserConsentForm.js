import PropTypes from 'prop-types';
import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { push } from 'react-router-redux';
import { resendActivation } from '../../actions/userActions';
import AppButton from '../common/AppButton';
import messages from '../../resources/messages';
import { invalidEmail } from '../../lib/formValidators';
import withIntlForm from '../common/hocs/IntlForm';

const localMessages = {
  request: { id: 'user.requestConsent', defaultMessage: 'You need to consent to our policies' },
  title: { id: 'user.requestConsent.title', defaultMessage: 'Didn\'t get the activation email?' },
  intro: { id: 'user.requestConsent.intro', defaultMessage: 'Sorry about that! Enter your email address again and we\'ll send you another activation email.' },
};

const UserConsentForm = (props) => {
  const { handleSubmit, handleFormSubmission, pristine, submitting, renderCheckbox } = props;
  const { formatMessage } = props.intl;
  return (
    <Grid>
      <form onSubmit={handleSubmit(handleFormSubmission.bind(this))} className="app-form request-consent-form">
        <Row>
          <Col lg={12}>
            <h1><FormattedMessage {...localMessages.title} /></h1>
            <p><FormattedMessage {...localMessages.intro} /></p>
          </Col>
        </Row>
        <Row>
          <Col lg={8} xs={12}>
            <Field
              fullWidth
              name="has_consented"
              component={renderCheckbox}
              label={messages.userEmail}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <AppButton
              type="submit"
              label={formatMessage(localMessages.request)}
              primary
              disabled={pristine || submitting}
            />
          </Col>
        </Row>
      </form>
    </Grid>
  );
};

UserConsentForm.propTypes = {
  // from composition
  intl: PropTypes.object.isRequired,
  location: PropTypes.object,
  redirect: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  renderCheckbox: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  // from state
  // from dispatch
  handleFormSubmission: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = dispatch => ({
  handleFormSubmission: (values) => {
    dispatch(resendActivation(values))
      .then((response) => { // go to home page
        if (response.success === 1) {
          dispatch(push('/user/resend-activation-success'));
        }
      });
  },
});

// in-browser validation callback
function validate(values) {
  const errors = {};
  if (invalidEmail(values.email)) {
    errors.email = localMessages.missingEmail;
  }
  return errors;
}

const reduxFormConfig = {
  form: 'resend-activation-form',
  validate,
};

export default
injectIntl(
  withIntlForm(
    reduxForm(reduxFormConfig)(
      connect(mapStateToProps, mapDispatchToProps)(
        UserConsentForm
      )
    )
  )
);
