import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { fetchSourceTopWords } from '../../../actions/sourceActions';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import withHelp from '../../common/hocs/HelpfulContainer';
import messages from '../../../resources/messages';
import EditableWordCloudDataCard from '../../common/EditableWordCloudDataCard';
import { calculateTimePeriods, getCurrentDate, oneMonthBefore } from '../../../lib/dateUtil';
import { urlToExplorerQuery } from '../../../lib/urlUtil';

const localMessages = {
  title: { id: 'source.summary.topWords.title', defaultMessage: 'Top Words' },
  intro: { id: 'source.summary.topWords.info',
    defaultMessage: '<p>This wordcloud shows you the most commonly used words in this source (based on a sample of stories). Click a word to load an Explorer search showing you how the this source writes about it.</p>' },
  helpTitle: { id: 'source.summary.sentenceCount.help.title', defaultMessage: 'About Top Words' },
};

class SourceTopWordsContainer extends React.Component {
  fetchWordsByTimePeriod = (dateQuery, timePeriod) => {
    const { fetchData } = this.props;
    fetchData(timePeriod, dateQuery);
  }

  defaultOnWordClick = (word) => {
    const { source } = this.props;
    const endDate = getCurrentDate();
    const startDate = oneMonthBefore(endDate);
    const searchStr = `${word.stem}*`;
    const explorerUrl = urlToExplorerQuery(source.name || source.url, searchStr, [source.media_id], [], startDate, endDate);
    window.open(explorerUrl, '_blank');
  }

  render() {
    const { source, words, helpButton, timePeriod } = this.props;
    const { formatMessage } = this.props.intl;
    const downloadUrl = `/api/sources/${source.media_id}/words/wordcount.csv`;
    return (
      <EditableWordCloudDataCard
        words={words}
        handleTimePeriodClick={this.fetchWordsByTimePeriod}
        selectedTimePeriod={timePeriod}
        downloadUrl={downloadUrl}
        targetURL={`/sources/${source.media_id}`}
        onViewModeClick={this.defaultOnWordClick}
        title={formatMessage(localMessages.title)}
        domId={`media-source-top-words-${source.media_id}`}
        width={900}
        helpButton={helpButton}
      />
    );
  }
}

SourceTopWordsContainer.propTypes = {
  // from parent
  source: PropTypes.object.isRequired,
  // from state
  fetchData: PropTypes.func.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  words: PropTypes.array,
  timePeriod: PropTypes.string.isRequired,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
  // from composition
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.sources.selected.topWords.fetchStatus,
  words: state.sources.sources.selected.topWords.list.wordcounts,
  timePeriod: state.sources.sources.selected.topWords.timePeriod,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (timePeriod, dateQuery) => {
    dispatch(fetchSourceTopWords(ownProps.source.media_id, { timePeriod, q: dateQuery }));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      // need to calculateTimePeriods here in order to default to week correctly
      dispatchProps.fetchData(stateProps.timePeriod, calculateTimePeriods(stateProps.timePeriod));
    },
  });
}

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    withHelp(localMessages.helpTitle, [localMessages.intro, messages.wordSpaceLayoutHelp])(
      withAsyncFetch(
        SourceTopWordsContainer
      )
    )
  )
);
