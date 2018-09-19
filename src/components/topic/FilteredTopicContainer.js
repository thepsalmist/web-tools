import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';
import LoadingSpinner from '../common/LoadingSpinner';
import { ErrorNotice } from '../common/Notice';
import TopicFilterControlBar from './controlbar/TopicFilterControlBar';
import * as fetchConstants from '../../lib/fetchConstants';

const localMessages = {
  exceededStories: { id: 'topics.summary.exceededStories', defaultMessage: 'Your topic has collected more than the 100,000 story limit! You\'ll need to make a new topic with fewer seed stories if you want to investigate this.  Email us at support@mediacloud.org if you need help narrowing down your query.' },
  noUsableSnapshot: { id: 'topics.summary.noUsableSnapshot', defaultMessage: 'Error in topic generation. More info on the way. No usable snapshots.' },
};

class FilteredTopicContainer extends React.Component {
  hasUsableSnapshot() {
    const { snapshots } = this.props;
    const hasUsableSnapshot = snapshots.filter(d => d.isUsable);
    return (hasUsableSnapshot.length > 0);
  }

  snapshotIsSet() {
    const { filters, topicId } = this.props;
    return (topicId && (filters.snapshotId && this.hasUsableSnapshot()));
  }

  render() {
    const { children, location, topicId, topicInfo, filters, fetchStatusInfo,
      fetchStatusSnapshot } = this.props;
    let subContent = null;
    // If the generation process is still ongoing, ask the user to wait a few minutes
    if (this.snapshotIsSet()) {
      let childContent;
      // show spinner until there is a valid timespan
      if (filters.timespanId) {
        childContent = children;
      } else {
        childContent = <LoadingSpinner />;
      }
      subContent = (
        <div>
          <TopicFilterControlBar
            topicId={topicId}
            topic={topicInfo}
            location={location}
            filters={filters}
          />
          {childContent}
        </div>
      );
    } else if (fetchStatusInfo !== fetchConstants.FETCH_SUCCEEDED
      && fetchStatusSnapshot !== fetchConstants.FETCH_SUCCEEDED) {
      // how to distinguish between fetch-ongoing and a generating snapshot?
      subContent = <LoadingSpinner />;
    } else if (fetchStatusInfo === fetchConstants.FETCH_SUCCEEDED
      && fetchStatusSnapshot === fetchConstants.FETCH_INVALID
      && !this.hasUsableSnapshot()) {
      // how to distinguish between fetch-ongoing and a generating snapshot?
      if (topicInfo && topicInfo.message) {
        if (topicInfo.message.includes('exceeds')) {
          subContent = (
            <ErrorNotice><FormattedHTMLMessage {...localMessages.exceededStories} /></ErrorNotice>
          );
        }
      }
    }
    return (subContent);
  }
}

FilteredTopicContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  children: PropTypes.node,
  location: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  fetchStatusInfo: PropTypes.string,
  fetchStatusSnapshot: PropTypes.string,
  // from state
  filters: PropTypes.object.isRequired,
  topicId: PropTypes.number.isRequired,
  topicInfo: PropTypes.object.isRequired,
  snapshots: PropTypes.array.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  filters: state.topics.selected.filters,
  topicId: state.topics.selected.id,
  fetchStatusInfo: state.topics.selected.info.fetchStatus,
  fetchStatusSnapshot: state.topics.selected.snapshots.fetchStatus,
  topicInfo: state.topics.selected.info,
  params: ownProps.params,
  snapshots: state.topics.selected.snapshots.list,
});

export default
injectIntl(
  connect(mapStateToProps)(
    FilteredTopicContainer
  )
);
