import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { fetchMediaStories, sortMediaStories, filterByFocus } from '../../../actions/topicActions';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import withCsvDownloadNotifyContainer from '../../common/hocs/CsvDownloadNotifyContainer';
import withHelp from '../../common/hocs/HelpfulContainer';
import messages from '../../../resources/messages';
import TopicStoryTable from '../TopicStoryTable';
import { filteredLocation, filtersAsUrlParams } from '../../util/location';
import DataCard from '../../common/DataCard';
import { DownloadButton } from '../../common/IconButton';
import { HELP_STORIES_CSV_COLUMNS } from '../../../lib/helpConstants';

const STORIES_TO_SHOW = 10;

const localMessages = {
  helpTitle: { id: 'media.stories.help.title', defaultMessage: 'About Media Stories' },
  helpIntro: { id: 'media.stories.help.intro', defaultMessage: '<p>This is a table of stories published by this Media Source within the Topic.</p>' },
};

class MediaStoriesContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { fetchData, filters, sort } = this.props;
    if ((nextProps.filters !== filters) || (nextProps.sort !== sort)) {
      fetchData(nextProps);
    }
  }

  onChangeSort = (newSort) => {
    const { sortData } = this.props;
    sortData(newSort);
  }

  downloadCsv = () => {
    const { mediaId, topicId, filters, notifyOfCsvDownload } = this.props;
    const filtersAsParams = filtersAsUrlParams(filters);
    const url = `/api/topics/${topicId}/media/${mediaId}/stories.csv?${filtersAsParams}`;
    window.location = url;
    notifyOfCsvDownload(HELP_STORIES_CSV_COLUMNS);
  }

  render() {
    const { inlinkedStories, showTweetCounts, topicId, helpButton, handleFocusSelected } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <DataCard>
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <h2>
          <FormattedMessage {...messages.storyPlural} />
          {helpButton}
        </h2>
        <TopicStoryTable
          stories={inlinkedStories}
          showTweetCounts={showTweetCounts}
          topicId={topicId}
          onChangeSort={this.onChangeSort}
          onChangeFocusSelection={handleFocusSelected}
        />
      </DataCard>
    );
  }
}

MediaStoriesContainer.propTypes = {
  // from composition chain
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
  notifyOfCsvDownload: PropTypes.func.isRequired,
  // from parent
  mediaId: PropTypes.number.isRequired,
  topicId: PropTypes.number.isRequired,
  // from mergeProps
  asyncFetch: PropTypes.func.isRequired,
  // from fetchData
  fetchData: PropTypes.func.isRequired,
  sortData: PropTypes.func.isRequired,
  handleFocusSelected: PropTypes.func.isRequired,
  // from state
  sort: PropTypes.string.isRequired,
  filters: PropTypes.object.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  inlinkedStories: PropTypes.array.isRequired,
  showTweetCounts: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.mediaSource.stories.fetchStatus,
  inlinkedStories: state.topics.selected.mediaSource.stories.stories,
  sort: state.topics.selected.mediaSource.stories.sort,
  filters: state.topics.selected.filters,
  showTweetCounts: Boolean(state.topics.selected.info.ch_monitor_id),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (stateProps) => {
    const params = {
      ...stateProps.filters,
      sort: stateProps.sort,
      limit: STORIES_TO_SHOW,
    };
    dispatch(fetchMediaStories(ownProps.topicId, ownProps.mediaId, params));
  },
  handleFocusSelected: (focusId) => {
    const newLocation = filteredLocation(ownProps.location, { focusId, timespanId: null });
    dispatch(push(newLocation));
    dispatch(filterByFocus(focusId));
  },
  sortData: (sort) => {
    dispatch(sortMediaStories(sort));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(stateProps);
    },
  });
}

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    withHelp(localMessages.helpTitle, [localMessages.helpIntro, messages.storiesTableHelpText])(
      withAsyncFetch(
        withCsvDownloadNotifyContainer(
          MediaStoriesContainer
        )
      )
    )
  )
);
