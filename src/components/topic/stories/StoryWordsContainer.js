import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import withSampleSize from '../../common/composers/SampleSize';
import withCsvDownloadNotifyContainer from '../../common/hocs/CsvDownloadNotifyContainer';
import { fetchTopicTopWords } from '../../../actions/topicActions';
import withFilteredAsyncData from '../FilteredAsyncDataContainer';
import withHelp from '../../common/hocs/HelpfulContainer';
import EditableWordCloudDataCard from '../../common/EditableWordCloudDataCard';
import { filteredLinkTo, filtersAsUrlParams, combineQueryParams } from '../../util/location';
import messages from '../../../resources/messages';
import { generateParamStr } from '../../../lib/apiUtil';
import { mergeFilters } from '../../../lib/topicFilterUtil';
import { topicDownloadFilename } from '../../util/topicUtil';

const localMessages = {
  helpTitle: { id: 'story.words.help.title', defaultMessage: 'About Story Top Words' },
  helpText: { id: 'story.words.help.into',
    defaultMessage: '<p>This is a visualization showing the top words in this Story.  Rollover a word to see the stem and how often it was used in this Story.</p>',
  },
};

const WORD_CLOUD_DOM_ID = 'word-cloud';

const StoryWordsContainer = (props) => {
  const { storiesId, topicInfo, handleWordCloudClick, filters, words, initSampleSize, onViewSampleSizeClick } = props;
  const { formatMessage } = props.intl;
  const urlDownload = `/api/topics/${topicInfo.topics_id}/words.csv?${filtersAsUrlParams({ ...filters, q: combineQueryParams(filters.q, `stories_id:${storiesId}`) })}`;
  return (
    <EditableWordCloudDataCard
      width={700}
      words={words}
      explore={filteredLinkTo(`/topics/${topicInfo.topics_id}/words`, filters)}
      initSampleSize={initSampleSize}
      downloadUrl={urlDownload}
      onViewModeClick={word => handleWordCloudClick(word, props)}
      onViewSampleSizeClick={onViewSampleSizeClick}
      title={formatMessage(messages.topWords)}
      domId={WORD_CLOUD_DOM_ID}
      svgDownloadPrefix={`${topicDownloadFilename(topicInfo.name, filters)}-story-${storiesId}-words`}
      includeTopicWord2Vec
    />
  );
};

StoryWordsContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
  onViewSampleSizeClick: PropTypes.func.isRequired,
  initSampleSize: PropTypes.string.isRequired,
  // from parent
  storiesId: PropTypes.number.isRequired,
  topicName: PropTypes.string.isRequired,
  filters: PropTypes.object,
  // from dispatch
  handleWordCloudClick: PropTypes.func,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  words: PropTypes.array.isRequired,
  topicInfo: PropTypes.object,

};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.story.words.fetchStatus,
  topicInfo: state.topics.selected.info,
  words: state.topics.selected.story.words.list,
  filters: state.topics.selected.filters,
});

const mapDispatchToProps = dispatch => ({
  handleWordCloudClick: (word, props) => {
    const params = generateParamStr({ ...props.filters, stem: word.stem, term: word.term });
    const url = `/topics/${props.topicId}/words/${word.stem}*?${params}`;
    dispatch(push(url));
  },
});

const fetchAsyncData = (dispatch, props) => {
  const filterObj = mergeFilters(props, `stories_id:${props.storiesId}`);
  dispatch(fetchTopicTopWords(props.topicId, filterObj));
};

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withHelp(localMessages.helpTitle, [localMessages.helpText, messages.wordcloudHelpText, messages.wordCloudTopicWord2VecLayoutHelp])(
      withSampleSize(
        withFilteredAsyncData(fetchAsyncData)(
          withCsvDownloadNotifyContainer(
            StoryWordsContainer
          )
        )
      )
    )
  )
);
