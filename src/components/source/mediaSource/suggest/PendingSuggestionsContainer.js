import PropTypes from 'prop-types';
import React from 'react';
import Link from 'react-router/lib/Link';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { fetchSourceSuggestions, updateSourceSuggestion } from '../../../../actions/sourceActions';
import withAsyncData from '../../../common/hocs/AsyncDataContainer';
import SourceSuggestion from './SourceSuggestion';
import PageTitle from '../../../common/PageTitle';

const localMessages = {
  title: { id: 'sources.suggestions.pending.title', defaultMessage: 'Pending Suggestions' },
  intro: { id: 'sources.suggestions.pending.intro', defaultMessage: 'Here is a list of media source suggestions made by users.  Approve or reject them as you see fit!' },
  history: { id: 'sources.suggestions.pending.historyLink', defaultMessage: 'See a full history of suggestions.' },
};

const PendingSuggestionsContainer = ({ suggestions, handleApprove, handleReject }) => (
  <Grid>
    <Row>
      <Col lg={12} md={12} sm={12}>
        <PageTitle value={localMessages.title} />
        <h1><FormattedMessage {...localMessages.title} /></h1>
        <p><FormattedMessage {...localMessages.intro} /></p>
        <p>
          <Link to="/sources/suggestions/history">
            <FormattedMessage {...localMessages.history} />
          </Link>
        </p>
      </Col>
    </Row>
    <Row>
      { suggestions.map(s => (
        <Col key={s.media_suggestions_id} lg={12}>
          <SourceSuggestion suggestion={s} markable onApprove={handleApprove} onReject={handleReject} />
        </Col>
      ))}
    </Row>
  </Grid>
);

PendingSuggestionsContainer.propTypes = {
  // from the composition chain
  intl: PropTypes.object.isRequired,
  // from parent
  // from state
  fetchStatus: PropTypes.string.isRequired,
  suggestions: PropTypes.array.isRequired,
  // from dispatch
  handleApprove: PropTypes.func,
  handleReject: PropTypes.func,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.sources.suggestions.fetchStatus,
  suggestions: state.sources.sources.suggestions.list,
});

const mapDispatchToProps = dispatch => ({
  handleApprove: (suggestion, reason) => {
    dispatch(updateSourceSuggestion({
      suggestionId: suggestion.media_suggestions_id,
      status: 'approved',
      reason,
    })).then(() => dispatch(fetchSourceSuggestions({ all: false })));
  },
  handleReject: (suggestion, reason) => {
    dispatch(updateSourceSuggestion({
      suggestionId: suggestion.media_suggestions_id,
      status: 'rejected',
      reason,
    })).then(() => dispatch(fetchSourceSuggestions({ all: false })));
  },
});

const fetchAsyncData = dispatch => dispatch(fetchSourceSuggestions({ all: false }));

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withAsyncData(fetchAsyncData)(
      PendingSuggestionsContainer
    )
  )
);
