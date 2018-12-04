import PropTypes from 'prop-types';
import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import withIntlForm from '../../hocs/IntlForm';
import { invalidEmail } from '../../../../lib/formValidators';

const localMessages = {
  nameLabel: { id: 'user.update.name.label', defaultMessage: 'User Name' },
  emailLabel: { id: 'user.update.email.label', defaultMessage: 'Email' },
  notesLabel: { id: 'user.update.notes.label', defaultMessage: 'Notes' },
  activeLabel: { id: 'user.update.active.label', defaultMessage: 'Active?' },
  nameError: { id: 'user.update.name.error', defaultMessage: 'You must have a name for this user.' },
  emailError: { id: 'user.update.url.error', defaultMessage: 'You must have an email for this user.' },
  maxStoriesLabel: { id: 'user.update.maxStories', defaultMessage: 'Max Stories' },
  weeklyQuotaLabel: { id: 'user.update.quota', defaultMessage: 'Weekly Quota' },
};

const UserDetailsForm = (props) => {
  const { renderTextField, renderCheckbox } = props;
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
            label={localMessages.nameLabel}
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
            label={localMessages.emailLabel}
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
            name="notes"
            component={renderTextField}
            label={localMessages.notesLabel}
            rows={5}
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
            disabled
          />
        </Col>
      </Row>
      <Row>
        <Col md={2}>
          <span className="label unlabeled-field-label">
            <FormattedMessage {...localMessages.maxStoriesLabel} />
          </span>
        </Col>
        <Col md={2}>
          <Field
            name="max_topic_stories"
            component={renderTextField}
            fullWidth
            label={localMessages.isActiveLabel}
            disabled
          />
        </Col>
      </Row>
      <Row>
        <Col md={2}>
          <span className="label unlabeled-field-label">
            <FormattedMessage {...localMessages.weeklyQuotaLabel} />
          </span>
        </Col>
        <Col md={2}>
          <Field
            name="weekly_quota"
            component={renderTextField}
            fullWidth
            label={localMessages.isActiveLabel}
            disabled
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
  return errors;
}

const reduxFormConfig = {
  form: 'userForm',
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
