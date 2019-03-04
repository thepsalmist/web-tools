import PropTypes from 'prop-types';
import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid/lib';
import withIntlForm from '../../common/hocs/IntlForm';
import AppButton from '../../common/AppButton';
import { emptyString } from '../../../lib/formValidators';
import messages from '../../../resources/messages';

const localMessages = {
  searchHint: { id: 'topic.search.searchHint', defaultMessage: 'search by topic name' },
  nameError: { id: 'topic.search.nameError', defaultMessage: 'Enter a topic name to search for' },
};

const TopicSearchForm = (props) => {
  const { pristine, submitting, handleSubmit, onSearch, renderTextField } = props;
  const { formatMessage } = props.intl;
  // need to init initialValues a bit on the way in to make lower-level logic work right
  return (
    <form className="app-form topic-search-form" name="topicSearchForm" onSubmit={handleSubmit(onSearch.bind(this))}>
      <Row>
        <Col lg={4}>
          <Field
            name="name"
            component={renderTextField}
            fullWidth
            placeholder={formatMessage(localMessages.searchHint)}
          />
        </Col>
        <Col lg={2}>
          <AppButton
            type="submit"
            label={messages.search}
            disabled={pristine || submitting}
            primary
          />
        </Col>
      </Row>
    </form>
  );
};

TopicSearchForm.propTypes = {
  // from parent
  onSearch: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  // from context
  intl: PropTypes.object.isRequired,
  renderTextField: PropTypes.func.isRequired,
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
  return errors;
}

const reduxFormConfig = {
  form: 'topicSearchForm',
  enableReinitialize: true,
  validate,
};

export default
withIntlForm(
  reduxForm(reduxFormConfig)(
    TopicSearchForm
  ),
);
