import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { fetchSourceSuggestions } from '../../../../actions/sourceActions';
import withAsyncFetch from '../../../common/hocs/AsyncContainer';
import SourceSuggestion from './SourceSuggestion';

const localMessages = {
  title: { id: 'sources.suggestions.pending.title', defaultMessage: 'All Suggestions' },
};

const allSuggestionsContainer = (props) => {
  const { suggestions } = props;
  const { formatMessage } = props.intl;
  const titleHandler = parentTitle => `${formatMessage(localMessages.title)} | ${parentTitle}`;
  return (
    <Grid>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <Helmet><title>{titleHandler()}</title></Helmet>
          <h1><FormattedMessage {...localMessages.title} /></h1>
        </Col>
      </Row>
      <Row>
        { suggestions.map(s => (
          <Col key={s.media_suggestions_id} lg={4}>
            <SourceSuggestion suggestion={s} markable={false} />
          </Col>
        ))}
      </Row>
    </Grid>
  );
};

allSuggestionsContainer.propTypes = {
  // from the composition chain
  intl: PropTypes.object.isRequired,
  // from parent
  // from state
  fetchStatus: PropTypes.string.isRequired,
  suggestions: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.sources.suggestions.fetchStatus,
  suggestions: state.sources.sources.suggestions.list,
});

const mapDispatchToProps = dispatch => ({
  asyncFetch: () => {
    dispatch(fetchSourceSuggestions({ all: true }));
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withAsyncFetch(
      allSuggestionsContainer
    )
  )
);
