import PropTypes from 'prop-types';
import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import PrivacyPolicyContainer from '../common/PrivacyPolicyContainer';
import TermsOfUseContainer from '../common/TermsOfUseContainer';
import AppButton from '../common/AppButton';
import messages from '../../resources/messages';
import withIntlForm from '../common/hocs/IntlForm';

const localMessages = {
  request: { id: 'user.requestConsent', defaultMessage: 'You need to consent to our policies' },
  terms: { id: 'user.requestConsent.title', defaultMessage: 'Terms Of Use' },
  policy: { id: 'user.requestConsent.intro', defaultMessage: 'Privacy Policy' },
  noConsent: { id: 'user.requestConsent.error', defaultMessage: 'We need you to consent to our policies.' },
};

const UserConsentForm = (props) => {
  const { handleSubmit, onSubmit, pristine, submitting, renderCheckbox } = props;
  const { formatMessage } = props.intl;
  return (
    <Grid>
      <form onSubmit={handleSubmit(onSubmit.bind(this))} className="app-form request-consent-form">
        <Row>
          <Col lg={12}>
            <h2><FormattedMessage {...localMessages.terms} /></h2>
          </Col>
        </Row>
        <Row>
          <Col lg={10}>
            <TermsOfUseContainer />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <h2><FormattedMessage {...localMessages.policy} /></h2>
          </Col>
        </Row>
        <Row>
          <Col lg={10}>
            <PrivacyPolicyContainer />
          </Col>
        </Row>
        <Row>
          <Col lg={8} xs={12}>
            <Field
              fullWidth
              name="has_consented"
              component={renderCheckbox}
              label={messages.userConsent}
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
  onSubmit: PropTypes.func.isRequired,
};

// in-browser validation callback
function validate(values) {
  const errors = {};
  if (!values.has_consented) {
    errors.has_consented = localMessages.noConsent;
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
      connect()(
        UserConsentForm
      )
    )
  )
);
