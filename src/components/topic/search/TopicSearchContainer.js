import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import PageTitle from '../../common/PageTitle';
import TopicSearchForm from './TopicSearchForm';
import MatchingTopicsContainer from './MatchingTopicsContainer';

const localMessages = {
  title: { id: 'topics.search.title', defaultMessage: 'Search for a Topic' },
};

const TopicSearch = props => (
  <Grid>
    <PageTitle value={localMessages.title} />
    <Row>
      <Col lg={10}>
        <h1><FormattedMessage {...localMessages.title} /></h1>
      </Col>
    </Row>
    <TopicSearchForm
      onSearch={values => props.dispatch(push({ pathname: '/topics/search', query: { name: values.name } }))}
      initialValues={{ name: props.location.query.name }}
    />
    <MatchingTopicsContainer searchString={props.location.query.name} />
  </Grid>
);

TopicSearch.propTypes = {
  // from compositional chain
  location: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default
injectIntl(
  connect()(
    TopicSearch
  )
);
