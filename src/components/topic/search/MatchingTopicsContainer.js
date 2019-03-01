import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import withAsyncData from '../../common/hocs/AsyncDataContainer';
import TopicPreviewList from '../list/TopicPreviewList';
import { fetchTopicSearchResults } from '../../../actions/topicActions';

const localMessages = {
  intro: { id: 'topics.search.intro', defaultMessage: 'Topics matching "{searchString}":' },
  noMatches: { id: 'topics.search.intro', defaultMessage: 'No matching topics.' },
};

const MatchingTopicsContainer = (props) => {
  const { topics, searchString } = props;
  let content;
  if (searchString && (searchString.length > 0) && (topics.length > 0)) {
    content = (
      <Row>
        <Col lg={12}>
          <h2><FormattedMessage {...localMessages.intro} values={{ searchString }} /></h2>
          <TopicPreviewList
            topics={topics}
            linkGenerator={t => `/topics/${t.topics_id}/summary`}
            emptyMsg={localMessages.noMatches}
          />
        </Col>
      </Row>
    );
  } else {
    content = (
      <Row>
        <Col lg={12}>
          <br /><br /><br />
          <FormattedMessage {...localMessages.noMatches} />
        </Col>
      </Row>
    );
  }
  return content;
};

MatchingTopicsContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  topics: PropTypes.array.isRequired,
  // from parent
  searchString: PropTypes.string,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.search.fetchStatus,
  topics: state.topics.search.topics,
});

const fetchAsyncData = (dispatch, { searchString }) => {
  if (searchString) {
    dispatch(fetchTopicSearchResults(searchString, { mode: 'full' }));
  }
};

export default
injectIntl(
  connect(mapStateToProps)(
    withAsyncData(fetchAsyncData, ['searchString'])(
      MatchingTopicsContainer
    )
  )
);
