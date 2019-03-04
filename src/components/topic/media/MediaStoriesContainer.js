import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { fetchMediaStories, sortMediaStories, filterByFocus } from '../../../actions/topicActions';
import withFilteredAsyncData from '../FilteredAsyncDataContainer';
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
  title: { id: 'media.stories.title', defaultMessage: 'Top Stories' },
  download: { id: 'media.stories.title', defaultMessage: 'Download CSV of all Stories' },
  helpTitle: { id: 'media.stories.help.title', defaultMessage: 'About Media Stories' },
  helpIntro: { id: 'media.stories.help.intro', defaultMessage: '<p>This is a table of stories published by this Media Source within the Topic.</p>' },
};

class MediaStoriesContainer extends React.Component {
  downloadCsv = () => {
    const { mediaId, topicId, filters, notifyOfCsvDownload } = this.props;
    const filtersAsParams = filtersAsUrlParams(filters);
    const url = `/api/topics/${topicId}/media/${mediaId}/stories.csv?${filtersAsParams}`;
    window.location = url;
    notifyOfCsvDownload(HELP_STORIES_CSV_COLUMNS);
  }

  render() {
    const { inlinkedStories, showTweetCounts, topicId, helpButton, handleFocusSelected, handleChangeSort } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <DataCard>
        <div className="actions">
          <DownloadButton tooltip={formatMessage(localMessages.download)} onClick={this.downloadCsv} />
        </div>
        <h2>
          <FormattedMessage {...localMessages.title} />
          {helpButton}
        </h2>
        <TopicStoryTable
          stories={inlinkedStories}
          showTweetCounts={showTweetCounts}
          topicId={topicId}
          onChangeSort={handleChangeSort}
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
  filters: PropTypes.object.isRequired,
  // from parent
  mediaId: PropTypes.number.isRequired,
  topicId: PropTypes.number.isRequired,
  // from fetchData
  handleChangeSort: PropTypes.func.isRequired,
  handleFocusSelected: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  inlinkedStories: PropTypes.array.isRequired,
  sort: PropTypes.string.isRequired,
  showTweetCounts: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.mediaSource.stories.fetchStatus,
  inlinkedStories: state.topics.selected.mediaSource.stories.stories,
  sort: state.topics.selected.mediaSource.stories.sort,
  showTweetCounts: Boolean(state.topics.selected.info.ch_monitor_id),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleFocusSelected: (focusId) => {
    const newLocation = filteredLocation(ownProps.location, { focusId, timespanId: null });
    dispatch(push(newLocation));
    dispatch(filterByFocus(focusId));
  },
  handleChangeSort: (sort) => {
    dispatch(sortMediaStories(sort));
  },
});

const fetchAsyncData = (dispatch, props) => {
  const params = {
    ...props.filters,
    sort: props.sort,
    limit: STORIES_TO_SHOW,
  };
  dispatch(fetchMediaStories(props.topicId, props.mediaId, params));
};

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withHelp(localMessages.helpTitle, [localMessages.helpIntro, messages.storiesTableHelpText])(
      withCsvDownloadNotifyContainer(
        withFilteredAsyncData(fetchAsyncData, ['sort'])(
          MediaStoriesContainer
        )
      )
    )
  )
);
