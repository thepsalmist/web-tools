import PropTypes from 'prop-types';
import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import withIntlForm from '../../hocs/IntlForm';
import { invalidEmail } from '../../../../lib/formValidators';

const localMessages = {
  storyLabel: { id: 'story.update.name.label', defaultMessage: 'Title' },
  urlLabel: { id: 'story.update.url.label', defaultMessage: 'Url' },
  guidLabel: { id: 'story.update.guid.label', defaultMessage: 'GUID' },
  languageLabel: { id: 'story.update.language.label', defaultMessage: 'Language' },
  publishLabel: { id: 'story.update.active.label', defaultMessage: 'Published Date' },
  undateableLabel: { id: 'story.update.undateable.label', defaultMessage: 'Undateable?' },
};

const StoryDetailsForm = (props) => {
  const { renderTextField, renderCheckbox } = props;
  return (
    <div className="story-details-form">
      <form className="app-form user-form" name="userForm" onSubmit={handleSubmit(onSave.bind(this))}>
        <Row>
          <Col md={2}>
            <span className="label unlabeled-field-label">
              <FormattedMessage {...localMessages.storyLabel} />
            </span>
          </Col>
          <Col md={8}>
            <Field
              name="title"
              component={renderTextField}
              label={localMessages.storyLabel}
              fullWidth
              rows={2}
            />
          </Col>
        </Row>
        <Row>
          <Col md={2}>
            <span className="label unlabeled-field-label">
              <FormattedMessage {...localMessages.urlLabel} />
            </span>
          </Col>
          <Col md={8}>
            <Field
              name="url"
              component={renderTextField}
              label={localMessages.urlLabel}
              fullWidth
            />
          </Col>
        </Row>
        <Row>
          <Col md={2}>
            <span className="label unlabeled-field-label">
              <FormattedMessage {...localMessages.guidLabel} />
            </span>
          </Col>
          <Col md={8}>
            <Field
              name="guid"
              component={renderTextField}
              label={localMessages.guidLabel}
            />
          </Col>
        </Row>
        <Row>
          <Col md={2}>
            <span className="label unlabeled-field-label">
              <FormattedMessage {...localMessages.languageLabel} />
            </span>
          </Col>
          <Col md={8}>
            <Field
              name="language"
              component={renderTextField}
              label={localMessages.languageLabel}
              rows={5}
            />
          </Col>
        </Row>
        <Row>
          <Col md={2}>
            <span className="label unlabeled-field-label">
              <FormattedMessage {...localMessages.publishLabel} />
            </span>
          </Col>
          <Col md={2}>
            <Field
              name="publish_date"
              component={renderTextField}
              fullWidth
              label={localMessages.publishLabel}
            />
          </Col>
        </Row>
        <Row>
          <Col md={2}>
            <span className="label unlabeled-field-label">
              <FormattedMessage {...localMessages.undateableLabel} />
            </span>
          </Col>
          <Col md={2}>
            <Field
              name="undateable"
              component={renderCheckbox}
              fullWidth
            />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <AppButton
              type="submit"
              style={{ marginTop: 30 }}
              label={buttonLabel}
              disabled={pristine || submitting}
              primary
            />
          </Col>
        </Row>
      </form>
    </div>
  );
};

StoryDetailsForm.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  renderTextField: PropTypes.func.isRequired,
  renderCheckbox: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
};

// in-browser validation callback
function validate(values) {
  const errors = {};
  if (invalidEmail(values.url)) {
    errors.email = localMessages.missingUrl;
  }
  return errors;
}

const reduxFormConfig = {
  form: 'storyForm',
  validate,
};

export default
injectIntl(
  withIntlForm(
    reduxForm(reduxFormConfig)(
      StoryDetailsForm
    )
  )
);
