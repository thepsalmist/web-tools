import PropTypes from 'prop-types';
import React from 'react';
import { reduxForm, Field, propTypes } from 'redux-form';
import { Grid } from '@material-ui/core';
import withIntlForm from '../../common/hocs/IntlForm';
import TopicAdvancedForm from './TopicAdvancedForm';

const localMessages = {
  name: { id: 'topic.form.detail.name', defaultMessage: 'Topic Name (what is this about?)' },
  startDate: { id: 'topic.form.detail.startDate', defaultMessage: 'Start Date (inclusive)' },
  endDate: { id: 'topic.form.detail.endDate', defaultMessage: 'End Date (inclusive)' },
};

const TopicSeedDetailsForm = (props) => {
  const { renderTextField, initialValues } = props;
  const { formatMessage } = props.intl;
  return (
    <Grid container spacing={3}>
      <Grid item sm={6} xs={12}>
        <Field
          name="start_date"
          component={renderTextField}
          type="inline"
          fullWidth
          label={formatMessage(localMessages.startDate)}
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <Field
          name="end_date"
          component={renderTextField}
          type="inline"
          fullWidth
          label={formatMessage(localMessages.endDate)}
          helpertext={formatMessage(localMessages.endDate)}
        />
      </Grid>
      <TopicAdvancedForm
        initialValues={initialValues}
        destroyOnUnmount={false}
        form="topicForm"
        forceUnregisterOnUnmount
      />
    </Grid>
  );
};

TopicSeedDetailsForm.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  renderTextField: PropTypes.func.isRequired,
  // from parent
  initialValues: PropTypes.object,
};

export default
withIntlForm(
  reduxForm({ propTypes })(
    TopicSeedDetailsForm
  )
);
