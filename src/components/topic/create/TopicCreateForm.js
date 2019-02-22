import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid/lib';
import withIntlForm from '../../common/hocs/IntlForm';
import TopicSeedDetailsForm from './TopicSeedDetailsForm';

const localMessages = {
  basics: { id: 'topic.form.section.basics', defaultMessage: 'Basics' },
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
        <Col lg={12}>
          <h2><FormattedMessage {...localMessages.basics} /></h2>
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <Field
            name="name"
            component={renderTextField}
            fullWidth
            label={formatMessage(localMessages.name)}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <Field
            name="description"
            component={renderTextField}
            fullWidth
            label={formatMessage(localMessages.description)}
          />
        </Col>
      </Row>
      <TopicSeedDetailsForm initialValues={initialValues} />
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
  TopicCreateForm
);
