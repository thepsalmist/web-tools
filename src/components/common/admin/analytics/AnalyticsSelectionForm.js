import PropTypes from 'prop-types';
import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid/lib';
import MenuItem from '@material-ui/core/MenuItem';
import { FormattedMessage } from 'react-intl';
import withIntlForm from '../../hocs/IntlForm';
import AppButton from '../../AppButton';
import messages from '../../../../resources/messages';

const localMessages = {
  actionExplorerQuery: { id: 'analytics.action.explorerQuery', defaultMessage: 'Explorer Queries' },
  actionSourcesView: { id: 'analytics.action.sourcesView', defaultMessage: 'Source Manager Views' },
  part1: { id: 'analytics.form.part1', defaultMessage: 'Show top' },
  part2: { id: 'analytics.form.part2', defaultMessage: 'based on' },
};

const AnalyticsSelectionForm = (props) => {
  const { pristine, submitting, handleSubmit, onSearch, renderSelect } = props;
  return (
    <form className="app-form analytics-form" name="AnalyticsSelectionForm" onSubmit={handleSubmit(onSearch.bind(this))}>
      <Row>
        <Col lg={12}>
          <span className="form-inline-text"><FormattedMessage {...localMessages.part1} /></span>
          <Field name="type" component={renderSelect}>
            <MenuItem key="media" value="media"><FormattedMessage {...messages.media} /></MenuItem>
            <MenuItem key="collection" value="collection"><FormattedMessage {...messages.collectionName} /></MenuItem>
          </Field>
          <span className="form-inline-text"><FormattedMessage {...localMessages.part2} /></span>
          <Field name="action" component={renderSelect}>
            <MenuItem key="explorer-query" value="explorer-query"><FormattedMessage {...localMessages.actionExplorerQuery} /></MenuItem>
            <MenuItem key="sources-view" value="sources-view"><FormattedMessage {...localMessages.actionSourcesView} /></MenuItem>
          </Field>
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

AnalyticsSelectionForm.propTypes = {
  // from parent
  onSearch: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  // from context
  intl: PropTypes.object.isRequired,
  renderSelect: PropTypes.func.isRequired,
  // from form healper
  handleSubmit: PropTypes.func,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

const reduxFormConfig = {
  form: 'AnalyticsSelectionForm',
  enableReinitialize: true,
};

export default
withIntlForm(
  reduxForm(reduxFormConfig)(
    AnalyticsSelectionForm
  ),
);
