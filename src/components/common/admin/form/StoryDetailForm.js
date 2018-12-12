import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { reduxForm, Field } from 'redux-form';
import MenuItem from '@material-ui/core/MenuItem';
import { Row, Col } from 'react-flexbox-grid/lib';
import withIntlForm from '../../hocs/IntlForm';
import AppButton from '../../AppButton';
import { emptyString, invalidDate } from '../../../../lib/formValidators';
import { isValidSolrDate } from '../../../../lib/dateUtil';
import messages from '../../../../resources/messages';

const localMessages = {
  mainTitle: { id: 'story.maintitle', defaultMessage: 'Update Story' },
  nameError: { id: 'story.nameError', defaultMessage: 'Your story needs a title' },
  urlError: { id: 'story.urlError', defaultMessage: 'Your story needs a url' },
  guidLabel: { id: 'story.update.guid.label', defaultMessage: 'GUID' },
  dateError: { id: 'stoyr.update.date.error', defaultMessage: 'Please provide a date in YYYY-MM-DD format.' },
  titleError: { id: 'stoyr.update.title.error', defaultMessage: 'Your story needs a title.' },
  guidError: { id: 'stoyr.update.guid.error', defaultMessage: 'Your story needs a guid.' },
};

const StoryDetailForm = (props) => {
  const { initialValues, buttonLabel, pristine, submitting, handleSubmit, onSave, renderTextField, renderCheckbox, renderSelect, language } = props;
  const { formatMessage } = props.intl;
  // need to init initialValues a bit on the way in to make lower-level logic work right
  const cleanedInitialValues = initialValues ? { ...initialValues } : {};
  if (cleanedInitialValues.disabled === undefined) {
    cleanedInitialValues.disabled = false;
  }
  return (
    <form className="app-form story-form" name="storyDetailForm" onSubmit={handleSubmit(onSave.bind(this))}>
      <Row>
        <Col lg={12}>
          <Field
            name="title"
            component={renderTextField}
            fullWidth
            label={formatMessage(messages.storyTitle)}
            placeholder={formatMessage(messages.storyTitle)}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <Field
            name="guid"
            component={renderTextField}
            fullWidth
            label={formatMessage(localMessages.guidLabel)}
            placeholder={formatMessage(localMessages.guidLabel)}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <Field
            name="url"
            component={renderTextField}
            type="inline"
            fullWidth
            label={formatMessage(messages.storyUrl)}
            placeholder={formatMessage(messages.storyUrl)}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <Field
            name="language"
            component={renderSelect}
            type="inline"
            fullWidth
            label={formatMessage(messages.language)}
            placeholder={formatMessage(messages.language)}
          >
            {language.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </Field>
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <Field
            name="publish_date"
            component={renderTextField}
            type="inline"
            fullWidth
            label={formatMessage(messages.storyDate)}
            placeholder={formatMessage(messages.storyDate)}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <Field
            name="undateable"
            component={renderCheckbox}
            type="inline"
            fullWidth
            label={formatMessage(messages.storyUndateable)}
            placeholder={formatMessage(messages.storyUndateable)}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <AppButton
            style={{ marginTop: 30 }}
            type="submit"
            label={buttonLabel}
            disabled={pristine || submitting}
            color="primary"
          />
        </Col>
      </Row>
    </form>
  );
};

StoryDetailForm.propTypes = {
  // from parent
  onSave: PropTypes.func.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  initialValues: PropTypes.object,
  language: PropTypes.array,
  // from context
  intl: PropTypes.object.isRequired,
  renderTextField: PropTypes.func.isRequired,
  renderCheckbox: PropTypes.func.isRequired,
  renderSelect: PropTypes.func.isRequired,
  collections: PropTypes.array,
  // from form healper
  handleSubmit: PropTypes.func,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

function validate(values) {
  const errors = {};
  if (emptyString(values.name)) {
    errors.name = localMessages.nameError;
  }
  if (emptyString(values.url)) {
    errors.url = localMessages.urlError;
  }
  if (invalidDate(values.custom_date) || !isValidSolrDate(values.custom_date)) {
    errors.custom_date = localMessages.dateError;
  }
  if (invalidDate(values.publish_date) || !isValidSolrDate(values.publish_date)) {
    errors.publish_date = localMessages.dateError;
  }
  return errors;
}

const reduxFormConfig = {
  form: 'storyDetailForm',
  validate,
};

export default
injectIntl(
  withIntlForm(
    reduxForm(reduxFormConfig)(
      StoryDetailForm
    ),
  ),
);
