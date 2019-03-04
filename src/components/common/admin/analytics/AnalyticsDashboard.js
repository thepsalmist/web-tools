import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { PERMISSION_ADMIN } from '../../../../lib/auth';
import Permissioned from '../../Permissioned';
import PageTitle from '../../PageTitle';
import AnalyticsSelectionForm from './AnalyticsSelectionForm';
import AnalyticsResultsContainer from './AnalyticsResultsContainer';

const localMessages = {
  title: { id: 'analytics.dashboard.title', defaultMessage: 'Analyics Dashboard' },
};

const AnalyticsDashboard = props => (
  <Permissioned onlyRole={PERMISSION_ADMIN}>
    <PageTitle value={localMessages.title} />
    <div className="analytics-dashboard">
      <Grid>
        <Row>
          <Col lg={12}>
            <h1><FormattedMessage {...localMessages.title} /></h1>
          </Col>
        </Row>
        <AnalyticsSelectionForm
          onSearch={values => props.dispatch(push({ pathname: '/admin/analytics', query: values }))}
          initialValues={props.location.query}
        />
        <Row>
          <Col lg={12}>
            <AnalyticsResultsContainer {...props.location.query} />
          </Col>
        </Row>
      </Grid>
    </div>
  </Permissioned>
);

AnalyticsDashboard.propTypes = {
  // from compositional chain
  location: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default
injectIntl(
  connect()(
    AnalyticsDashboard
  )
);
