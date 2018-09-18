import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { fetchStoryInlinks } from '../../../actions/topicActions';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import withHelp from '../../common/hocs/HelpfulContainer';
import messages from '../../../resources/messages';
import TopicStoryTable from '../TopicStoryTable';
import DataCard from '../../common/DataCard';
import { DownloadButton } from '../../common/IconButton';

const localMessages = {
  helpTitle: { id: 'story.inlinks.help.title', defaultMessage: 'About Story Inlinks' },
  helpIntro: { id: 'story.inlinks.help.intro', defaultMessage: '<p>This is a table of stories that link to this Story within the Topic.</p>' },
};

class StoryInlinksContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { fetchData, filters } = this.props;
    if (nextProps.filters !== filters) {
      fetchData(nextProps.filters);
    }
  }

  downloadCsv = () => {
    const { storiesId, topicId, filters } = this.props;
    const url = `/api/topics/${topicId}/stories/${storiesId}/inlinks.csv?timespanId=${filters.timespanId}&q=${filters.q}`;
    window.location = url;
  }

  render() {
    const { inlinkedStories, showTweetCounts, topicId, helpButton } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <DataCard>
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <h2>
          <FormattedMessage {...messages.inlinks} />
          {helpButton}
        </h2>
        <TopicStoryTable stories={inlinkedStories} showTweetCounts={showTweetCounts} topicId={topicId} />
      </DataCard>
    );
  }
}

StoryInlinksContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
  // from parent
  storiesId: PropTypes.number.isRequired,
  topicId: PropTypes.number.isRequired,
  // from mergeProps
  asyncFetch: PropTypes.func.isRequired,
  // from fetchData
  fetchData: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  inlinkedStories: PropTypes.array.isRequired,
  filters: PropTypes.object.isRequired,
  showTweetCounts: PropTypes.bool,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.story.inlinks.fetchStatus,
  inlinkedStories: state.topics.selected.story.inlinks.stories,
  filters: state.topics.selected.filters,
  showTweetCounts: Boolean(state.topics.selected.info.ch_monitor_id),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (filters) => {
    dispatch(fetchStoryInlinks(ownProps.topicId, ownProps.storiesId, filters));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(stateProps.filters);
    },
  });
}

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    withHelp(localMessages.helpTitle, [localMessages.helpIntro, messages.wordcloudHelpText])(
      withAsyncFetch(
        StoryInlinksContainer
      )
    )
  )
);
