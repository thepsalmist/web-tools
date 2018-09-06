import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { fetchCollectionTopWords } from '../../../actions/sourceActions';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import PeriodicEditableWordCloudDataCard from '../../common/PeriodicEditableWordCloudDataCard';
import withHelp from '../../common/hocs/HelpfulContainer';
import messages from '../../../resources/messages';
import { calculateTimePeriods, getCurrentDate, oneMonthBefore } from '../../../lib/dateUtil';
import { urlToExplorerQuery } from '../../../lib/urlUtil';

const localMessages = {
  title: { id: 'collection.summary.topWords.title', defaultMessage: 'Top Words' },
  intro: { id: 'collection.summary.topWords.intro',
    defaultMessage: '<p>This wordcloud shows you the most commonly used words in this collection (based on a sample of sentences). Click a word to load an Explorer search showing you how sources in this colleciton write about it.</p>' },
  helpTitle: { id: 'collection.summary.topWords.help.title', defaultMessage: 'About Top Words' },
};

class CollectionTopWordsContainer extends React.Component {
  fetchWordsByTimePeriod = (dateQuery, timePeriod) => {
    const { fetchData } = this.props;
    fetchData(timePeriod, dateQuery);
  }

  handleWordClick = (word) => {
    const { collectionName, collectionId } = this.props;
    const endDate = getCurrentDate();
    const startDate = oneMonthBefore(endDate);
    const searchStr = `${word.stem}*`;
    const explorerUrl = urlToExplorerQuery(collectionName, searchStr, [], [collectionId], startDate, endDate);
    window.open(explorerUrl, '_blank');
  }

  render() {
    const { collectionId, timePeriod, words, helpButton } = this.props;
    const { formatMessage } = this.props.intl;
    const downloadUrl = `/api/collections/${collectionId}/words/wordcount.csv`;
    return (
      <PeriodicEditableWordCloudDataCard
        words={words}
        handleTimePeriodClick={this.fetchWordsByTimePeriod}
        selectedTimePeriod={timePeriod}
        downloadUrl={downloadUrl}
        targetURL={`/collections/${collectionId}`}
        onViewModeClick={this.handleWordClick}
        title={formatMessage(localMessages.title)}
        domId={`collection-top-words-${collectionId}`}
        width={520}
        helpButton={helpButton}
      />
    );
  }
}

CollectionTopWordsContainer.propTypes = {
  // from parent
  collectionId: PropTypes.number.isRequired,
  collectionName: PropTypes.string.isRequired,
  // from dispath
  asyncFetch: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  timePeriod: PropTypes.string,
  words: PropTypes.array,
  // from composition
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.collections.selected.collectionTopWords.fetchStatus,
  words: state.sources.collections.selected.collectionTopWords.list.wordcounts,
  timePeriod: state.sources.collections.selected.collectionTopWords.timePeriod,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (timePeriod, dateQuery) => {
    dispatch(fetchCollectionTopWords(ownProps.collectionId, { timePeriod, q: dateQuery }));
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
        CollectionTopWordsContainer
      )
    )
  )
);
