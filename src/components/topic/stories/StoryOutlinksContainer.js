import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { fetchStoryOutlinks } from '../../../actions/topicActions';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import withHelp from '../../common/hocs/HelpfulContainer';
import messages from '../../../resources/messages';
import TopicStoryTable from '../TopicStoryTable';
import DataCard from '../../common/DataCard';
import { DownloadButton } from '../../common/IconButton';

const localMessages = {
  helpTitle: { id: 'story.inlinks.help.title', defaultMessage: 'About Story Outlinks' },
  helpIntro: { id: 'story.inlinks.help.intro', defaultMessage: '<p>This is a table of stories within this Topic that this Story links to.</p>' },
};

class StoryOutlinksContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { fetchData, filters } = this.props;
    if (nextProps.filters !== filters) {
      fetchData(nextProps.filters);
    }
  }

  downloadCsv = () => {
    const { storiesId, topicId, filters } = this.props;
    const url = `/api/topics/${topicId}/stories/${storiesId}/outlinks.csv?timespanId=${filters.timespanId}&q=${filters.q}`;
    window.location = url;
  }

  render() {
    const { outlinkedStories, showTweetCounts, topicId, helpButton } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <DataCard>
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <h2>
          <FormattedMessage {...messages.outlinks} />
          {helpButton}
        </h2>
        <TopicStoryTable stories={outlinkedStories} showTweetCounts={showTweetCounts} topicId={topicId} />
      </DataCard>
    );
  }
}

StoryOutlinksContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
  // from parent
  storiesId: PropTypes.number.isRequired,
  topicId: PropTypes.number.isRequired,
  // from mergeProps
  asyncFetch: PropTypes.func.isRequired,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  // from state
  filters: PropTypes.object.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  outlinkedStories: PropTypes.array.isRequired,
  showTweetCounts: PropTypes.bool,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.story.outlinks.fetchStatus,
  outlinkedStories: state.topics.selected.story.outlinks.stories,
  timespanId: state.topics.selected.filters.timespanId,
  filters: state.topics.selected.filters,
  showTweetCounts: Boolean(state.topics.selected.info.ch_monitor_id),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (filters) => {
    dispatch(fetchStoryOutlinks(ownProps.topicId, ownProps.storiesId, filters));
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
        StoryOutlinksContainer
      )
    )
  )
);
