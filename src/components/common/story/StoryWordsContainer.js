import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import withAsyncFetch from '../hocs/AsyncContainer';
import withHelp from '../hocs/HelpfulContainer';
import { fetchStoryWords } from '../../../actions/topicActions';
import EditableWordCloudDataCard from '../EditableWordCloudDataCard';
import { filteredLinkTo } from '../../util/location';
import messages from '../../../resources/messages';
import { generateParamStr } from '../../../lib/apiUtil';
import { topicDownloadFilename } from '../../util/topicUtil';

const localMessages = {
  helpTitle: { id: 'story.words.help.title', defaultMessage: 'About Story Top Words' },
  helpText: { id: 'story.words.help.into',
    defaultMessage: '<p>This is a visualization showing the top words in this Story.  Rollover a word to see the stem and how often it was used in this Story.</p>',
  },
};

const WORD_CLOUD_DOM_ID = 'word-cloud';

class StoryWordsContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { fetchData, filters } = this.props;
    if (nextProps.filters !== filters) {
      fetchData(nextProps);
    }
  }

  render() {
    const { storiesId, topicId, words, helpButton, handleWordCloudClick, filters, topicName } = this.props;
    const { formatMessage } = this.props.intl;
    const urlDownload = `/api/topics/${topicId}/stories/${storiesId}/words.csv`;
    return (
      <EditableWordCloudDataCard
        words={words}
        explore={filteredLinkTo(`/topics/${topicId}/words`, filters)}
        downloadUrl={urlDownload}
        onViewModeClick={handleWordCloudClick}
        title={formatMessage(messages.topWords)}
        helpButton={helpButton}
        domId={WORD_CLOUD_DOM_ID}
        svgDownloadPrefix={`${topicDownloadFilename(topicName, filters)}-story-${storiesId}-words`}
        includeTopicWord2Vec
      />
    );
  }
}

StoryWordsContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
  // from parent
  storiesId: PropTypes.number.isRequired,
  topicId: PropTypes.number.isRequired,
  topicName: PropTypes.string.isRequired,
  filters: PropTypes.object,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  asyncFetch: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  words: PropTypes.array.isRequired,
  handleWordCloudClick: PropTypes.func,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.story.words.fetchStatus,
  words: state.topics.selected.story.words.list,
  filters: state.topics.selected.filters,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (props) => {
    dispatch(fetchStoryWords(ownProps.topicId, ownProps.storiesId, props.filters));
  },
  pushToUrl: url => dispatch(push(url)),
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(stateProps); // fetch the info we need
    },
    handleWordCloudClick: (word) => {
      const params = generateParamStr({ ...stateProps.filters, stem: word.stem, term: word.term });
      const url = `/topics/${ownProps.topicId}/words/${word.stem}*?${params}`;
      dispatchProps.pushToUrl(url);
    },
  });
}

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    withHelp(localMessages.helpTitle, [localMessages.helpText, messages.wordcloudHelpText, messages.wordCloudTopicWord2VecLayoutHelp])(
      withAsyncFetch(
        StoryWordsContainer
      )
    )
  )
);
