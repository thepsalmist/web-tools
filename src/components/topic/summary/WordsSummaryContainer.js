import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import withSampleSize from '../../common/composers/SampleSize';
import withCsvDownloadNotifyContainer from '../../common/hocs/CsvDownloadNotifyContainer';
import { filteredLinkTo, filtersAsUrlParams } from '../../util/location';
import withFilteredAsyncData from '../FilteredAsyncDataContainer';
import withSummary from '../../common/hocs/SummarizedVizualization';
import EditableWordCloudDataCard from '../../common/EditableWordCloudDataCard';
import { fetchTopicTopWords } from '../../../actions/topicActions';
import messages from '../../../resources/messages';
import { generateParamStr } from '../../../lib/apiUtil';
import { topicDownloadFilename } from '../../util/topicUtil';

const WORD_CLOUD_DOM_ID = 'topic-summary-media-word-cloud';

const localMessages = {
  descriptionIntro: { id: 'topic.summary.words.help.intro',
    defaultMessage: '<p>Look at the top words to see how this topic was talked about. This can suggest what the dominant narrative was, and looking at different timespans can suggest how it evolved over time.</p>',
  },
};

const WordsSummaryContainer = (props) => {
  const { topicInfo, words, initSampleSize, onViewSampleSizeClick, filters, handleWordCloudClick } = props;
  const urlDownload = `/api/topics/${topicInfo.topics_id}/words.csv?${filtersAsUrlParams(filters)}`;
  return (
    <EditableWordCloudDataCard
      width={630}
      words={words}
      initSampleSize={initSampleSize}
      downloadUrl={urlDownload}
      border={false}
      onViewModeClick={handleWordCloudClick}
      onViewSampleSizeClick={onViewSampleSizeClick}
      domId={WORD_CLOUD_DOM_ID}
      svgDownloadPrefix={`${topicDownloadFilename(topicInfo.name, filters)}-words`}
      hideGoogleWord2Vec
      actionsAsLinksUnderneath
    />
  );
};

WordsSummaryContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  onViewSampleSizeClick: PropTypes.func.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  topicName: PropTypes.string.isRequired,
  filters: PropTypes.object.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  maxFontSize: PropTypes.number,
  minFontSize: PropTypes.number,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  initSampleSize: PropTypes.string,
  handleExplore: PropTypes.func.isRequired,
  // from state
  topicInfo: PropTypes.object,
  words: PropTypes.array,
  fetchStatus: PropTypes.string.isRequired,
  handleWordCloudClick: PropTypes.func,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.summary.topWords.fetchStatus,
  topicInfo: state.topics.selected.info,
  words: state.topics.selected.summary.topWords.list,
  filters: state.topics.selected.filters,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  // called from withSampleSize helper
  fetchData: ({ filtersWithSampleSize }) => {
    dispatch(fetchTopicTopWords(ownProps.topicId, { ...ownProps.filters, sample_size: filtersWithSampleSize.sample_size }));
  },
  pushToUrl: url => dispatch(push(url)),
  handleExplore: () => {
    const exploreUrl = filteredLinkTo(`/topics/${ownProps.topicId}/words`, ownProps.filters);
    dispatch(push(exploreUrl));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    handleWordCloudClick: (word) => {
      // imoprtant to pick term with the OR clause for other languages that we don't stem well
      const params = generateParamStr({ ...stateProps.filters, stem: word.stem, term: word.term || word.stem });
      const url = `/topics/${ownProps.topicId}/words/${word.stem}*?${params}`;
      dispatchProps.pushToUrl(url);
    },
  });
}

const fetchAysncData = (dispatch, props) => dispatch(fetchTopicTopWords(props.topicId, props.filters));

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    withSampleSize(
      withSummary(messages.topWords, localMessages.descriptionIntro, [messages.wordcloudHelpText, messages.wordCloudTopicWord2VecLayoutHelp])(
        withCsvDownloadNotifyContainer(
          withFilteredAsyncData(
            WordsSummaryContainer,
            fetchAysncData,
          )
        )
      )
    )
  )
);
