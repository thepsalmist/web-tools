import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { reduxForm, Field, propTypes } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid/lib';
import withIntlForm from '../../common/hocs/IntlForm';
import TopicAdvancedForm from './TopicAdvancedForm';

const localMessages = {
  basics: { id: 'topic.form.section.basics', defaultMessage: 'Create Topic Details' },
  name: { id: 'topic.form.detail.name', defaultMessage: 'Topic Name (what is this about?)' },
  startDate: { id: 'topic.form.detail.startDate', defaultMessage: 'Start Date (inclusive)' },
  endDate: { id: 'topic.form.detail.endDate', defaultMessage: 'End Date (inclusive)' },
};

const TopicSeedDetailsForm = (props) => {
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
            name="start_date"
            component={renderTextField}
            type="inline"
            fullWidth
            label={formatMessage(localMessages.startDate)}
          />
        </Col>
        <Col lg={6}>
          <Field
            name="end_date"
            component={renderTextField}
            type="inline"
            fullWidth
            label={formatMessage(localMessages.endDate)}
            helpertext={formatMessage(localMessages.endDate)}
          />
        </Col>
      </Row>
      <TopicAdvancedForm
        initialValues={initialValues}
        destroyOnUnmount={false}
        form="topicForm"
        forceUnregisterOnUnmount
      />
    </div>
  );
};

TopicSeedDetailsForm.propTypes = {
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
    TopicSeedDetailsForm
  )
);
