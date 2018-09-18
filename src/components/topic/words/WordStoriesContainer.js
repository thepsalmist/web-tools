import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { fetchWordStories, sortWordStories } from '../../../actions/topicActions';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import withCsvDownloadNotifyContainer from '../../common/hocs/CsvDownloadNotifyContainer';
import withHelp from '../../common/hocs/HelpfulContainer';
import messages from '../../../resources/messages';
import TopicStoryTable from '../TopicStoryTable';
import DataCard from '../../common/DataCard';
import { DownloadButton } from '../../common/IconButton';
import { filtersAsUrlParams } from '../../util/location';
import { HELP_STORIES_CSV_COLUMNS } from '../../../lib/helpConstants';

const STORIES_TO_SHOW = 10;

const localMessages = {
  title: { id: 'word.stories.title', defaultMessage: 'Stories that Use this Word' },
  helpTitle: { id: 'word.stories.help.title', defaultMessage: 'About Word Stories' },
  helpIntro: { id: 'word.stories.help.intro', defaultMessage: '<p>This is a table of stories pertaining this word within the Topic.</p>' },
};

class WordStoriesContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { fetchData, filters, sort } = this.props;
    if ((nextProps.filters !== filters)
      || (nextProps.sort !== sort)
      || (nextProps.stem !== this.props.stem)) {
      fetchData(nextProps.filters, nextProps.sort, nextProps.stem);
    }
  }

  handleSortData = (newSort) => {
    const { sortData } = this.props;
    sortData(newSort);
  }

  downloadCsv = () => {
    const { term, topicId, filters, notifyOfCsvDownload } = this.props;
    const url = `/api/topics/${topicId}/words/${term}*/stories.csv?${filtersAsUrlParams(filters)}`;
    window.location = url;
    notifyOfCsvDownload(HELP_STORIES_CSV_COLUMNS);
  }

  render() {
    const { inlinkedStories, topicId, helpButton, showTweetCounts } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <DataCard>
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <h2>
          <FormattedMessage {...localMessages.title} />
          {helpButton}
        </h2>
        <TopicStoryTable stories={inlinkedStories} showTweetCounts={showTweetCounts} topicId={topicId} onChangeSort={this.handleSortData} />
      </DataCard>
    );
  }
}

WordStoriesContainer.propTypes = {
  // from composition chain
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
  notifyOfCsvDownload: PropTypes.func.isRequired,
  // from parent
  stem: PropTypes.string.isRequired,
  term: PropTypes.string.isRequired,
  topicId: PropTypes.number.isRequired,
  filters: PropTypes.object.isRequired,
  // from mergeProps
  asyncFetch: PropTypes.func.isRequired,
  // from fetchData
  fetchData: PropTypes.func.isRequired,
  sortData: PropTypes.func.isRequired,
  // from state
  sort: PropTypes.string.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  inlinkedStories: PropTypes.array.isRequired,
  showTweetCounts: PropTypes.bool,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.word.stories.fetchStatus,
  inlinkedStories: state.topics.selected.word.stories.stories,
  sort: state.topics.selected.word.stories.sort,
  stem: state.topics.selected.word.info.stem,
  showTweetCounts: Boolean(state.topics.selected.info.ch_monitor_id),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (filters, sort, stem) => {
    const params = {
      ...filters,
      sort,
      limit: STORIES_TO_SHOW,
    };
    dispatch(fetchWordStories(ownProps.topicId, stem, params));
  },
  sortData: (sort) => {
    dispatch(sortWordStories(sort));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.filters, stateProps.sort, ownProps.stem);
    },
  });
}

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    withHelp(localMessages.helpTitle, [localMessages.helpIntro, messages.storiesTableHelpText])(
      withAsyncFetch(
        withCsvDownloadNotifyContainer(
          WordStoriesContainer
        )
      )
    )
  )
);
