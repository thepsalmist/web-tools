import PropTypes from 'prop-types';
import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import withIntlForm from '../../hocs/IntlForm';
import { invalidEmail, notEmptyString, passwordTooShort, stringsDoNotMatch } from '../../../../lib/formValidators';
import messages from '../../../../resources/messages';

const localMessages = {
  nameLabel: { id: 'user.update.name.label', defaultMessage: 'User Name' },
  emailLabel: { id: 'user.update.email.label', defaultMessage: 'Email' },
  notesLabel: { id: 'user.update.notes.label', defaultMessage: 'Notes' },
  activeLabel: { id: 'user.update.active.label', defaultMessage: 'Active?' },
  pwdLabel: { id: 'user.update.pwd.hint', defaultMessage: 'New Password' },
  confirmPwdLabel: { id: 'user.update.pwd.confirm', defaultMessage: 'Confirm New Password' },
  nameError: { id: 'user.update.name.error', defaultMessage: 'You must have a name for this user.' },
  emailError: { id: 'user.update.url.error', defaultMessage: 'You must have an email for this user.' },
};

const UserDetailsForm = (props) => {
  const { renderTextField, renderCheckbox, initialValues } = props;
  return (
    <div className="user-details-form">
      <Row>
        <Col md={2}>
          <span className="label unlabeled-field-label">
            <FormattedMessage {...localMessages.nameLabel} />
          </span>
        </Col>
        <Col md={4}>
          <Field
            name="full_name"
            component={renderTextField}
            fullWidth
          />
        </Col>
      </Row>
      <Row>
        <Col md={2}>
          <span className="label unlabeled-field-label">
            <FormattedMessage {...localMessages.emailLabel} />
          </span>
        </Col>
        <Col md={4}>
          <Field
            name="email"
            component={renderTextField}
            fullWidth
          />
        </Col>
      </Row>
      <Row>
        <Col md={2}>
          <span className="label unlabeled-field-label">
            <FormattedMessage {...localMessages.notesLabel} />
          </span>
        </Col>
        <Col md={8}>
          <Field
            name="public_notes"
            component={renderTextField}
            label={localMessages.notesLabel}
            fullWidth
            disabled={initialValues.disabled}
            rows={2}
          />
        </Col>
      </Row>
      <Row>
        <Col md={2}>
          <span className="label unlabeled-field-label">
            <FormattedMessage {...localMessages.activeLabel} />
          </span>
        </Col>
        <Col md={2}>
          <Field
            name="active"
            component={renderCheckbox}
            fullWidth
            label={localMessages.isActiveLabel}
            disabled={initialValues.disabled}
          />
        </Col>
      </Row>
      <Row>
        <Col md={2}>
          <Field
            name="password"
            component={renderTextField}
            fullWidth
            type="password"
            label={messages.userNewPassword}
            disabled={initialValues.disabled}
          />
        </Col>
      </Row>
      <Row>
        <Col md={2}>
          <Field
            name="confirmPassword"
            component={renderTextField}
            fullWidth
            type="password"
            label={messages.userConfirmPassword}
            disabled={initialValues.disabled}
          />
        </Col>
      </Row>
    </div>
  );
};

UserDetailsForm.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  renderTextField: PropTypes.func.isRequired,
  renderCheckbox: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
};

// in-browser validation callback
function validate(values) {
  const errors = {};
  if (invalidEmail(values.email)) {
    errors.email = localMessages.missingEmail;
  }
  if (notEmptyString(values.password) && passwordTooShort(values.password)) {
    errors.old_password = messages.passwordTooShort;
  }
  if (stringsDoNotMatch(values.password, values.confirm_password)) {
    errors.confirm_password = messages.passwordsMismatch;
  }
  return errors;
}

const reduxFormConfig = {
  form: 'sourceForm',
  validate,
};

export default
injectIntl(
  withIntlForm(
    reduxForm(reduxFormConfig)(
      UserDetailsForm
    )
  )
);
