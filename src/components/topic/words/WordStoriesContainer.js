import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { fetchWordStories, sortWordStories } from '../../../actions/topicActions';
import withFilteredAsyncData from '../FilteredAsyncDataContainer';
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
  title: { id: 'word.stories.title', defaultMessage: 'Top Stories (using this word)' },
  helpTitle: { id: 'word.stories.help.title', defaultMessage: 'About Word Stories' },
  helpIntro: { id: 'word.stories.help.intro', defaultMessage: '<p>This is a table of stories pertaining this word within the Topic.</p>' },
};

const WordStoriesContainer = (props) => {
  const { term, topicId, filters, notifyOfCsvDownload, inlinkedStories, handleChangeSort, helpButton,
    showTweetCounts } = props;
  const { formatMessage } = props.intl;
  return (
    <DataCard>
      <div className="actions">
        <DownloadButton
          tooltip={formatMessage(messages.download)}
          onClick={() => {
            const url = `/api/topics/${topicId}/words/${term}*/stories.csv?${filtersAsUrlParams(filters)}`;
            window.location = url;
            notifyOfCsvDownload(HELP_STORIES_CSV_COLUMNS);
          }}
        />
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
      />
    </DataCard>
  );
};

WordStoriesContainer.propTypes = {
  // from composition chain
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
  notifyOfCsvDownload: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  // from parent
  stem: PropTypes.string.isRequired,
  term: PropTypes.string.isRequired,
  topicId: PropTypes.number.isRequired,
  // from fetchData
  handleChangeSort: PropTypes.func.isRequired,
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

const mapDispatchToProps = dispatch => ({
  handleChangeSort: (sort) => {
    dispatch(sortWordStories(sort));
  },
});

const fetchAsyncData = (dispatch, props) => {
  const params = {
    ...props.filters,
    sort: props.sort,
    limit: STORIES_TO_SHOW,
  };
  dispatch(fetchWordStories(props.topicId, props.stem, params));
};

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withHelp(localMessages.helpTitle, [localMessages.helpIntro, messages.storiesTableHelpText])(
      withFilteredAsyncData(fetchAsyncData, ['stem', 'sort'])(
        withCsvDownloadNotifyContainer(
          WordStoriesContainer
        )
      )
    )
  )
);
