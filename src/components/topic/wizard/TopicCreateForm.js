import PropTypes from 'prop-types';
import React from 'react';
import { reduxForm, Field, propTypes } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid/lib';
import withIntlForm from '../../common/hocs/IntlForm';
import TopicSeedDetailsForm from './TopicSeedDetailsForm';

const localMessages = {
  name: { id: 'topic.form.detail.name', defaultMessage: 'Topic Name (what is this about?)' },
  nameError: { id: 'topic.form.detail.name.error', defaultMessage: 'Your topic needs a short dsecriptive name.' },
  description: { id: 'topic.form.detail.description', defaultMessage: 'Description (why are you making this?)' },
  descriptionError: { id: 'topic.form.detail.desciption.error', defaultMessage: 'Your topic need a description.' },
  createTopic: { id: 'topic.form.detail.create', defaultMessage: 'Create' },
};

const TopicCreateForm = (props) => {
  const { renderTextField, initialValues } = props;
  const { formatMessage } = props.intl;
  return (
    <div>
      <Row>
        <Col lg={4}>
          <Field
            name="name"
            component={renderTextField}
            fullWidth
            label={formatMessage(localMessages.name)}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <Field
            name="description"
            component={renderTextField}
            fullWidth
            label={formatMessage(localMessages.description)}
          />
        </Col>
      </Row>
      <TopicSeedDetailsForm
        initialValues={initialValues}
        destroyOnUnmount={false}
        form="topicForm"
        forceUnregisterOnUnmount
      />
    </div>
  );
};

TopicCreateForm.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  renderTextField: PropTypes.func.isRequired,
  renderCheckbox: PropTypes.func.isRequired,
  renderSelect: PropTypes.func.isRequired,
  // from parent
  initialValues: PropTypes.object,
};

export default
withIntlForm(
  reduxForm({ propTypes })(
    TopicCreateForm
  ),
);
