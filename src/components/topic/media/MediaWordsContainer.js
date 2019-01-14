import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import withSampleSize from '../../common/composers/SampleSize';
import withCsvDownloadNotifyContainer from '../../common/hocs/CsvDownloadNotifyContainer';
import { filteredLinkTo, filtersAsUrlParams, combineQueryParams } from '../../util/location';
import { fetchTopicTopWords } from '../../../actions/topicActions';
import withFilteredAsyncData from '../FilteredAsyncDataContainer';
import withHelp from '../../common/hocs/HelpfulContainer';
import EditableWordCloudDataCard from '../../common/EditableWordCloudDataCard';
import messages from '../../../resources/messages';
import { generateParamStr } from '../../../lib/apiUtil';
import { mergeFilters } from '../../../lib/topicFilterUtil';
import { topicDownloadFilename } from '../../util/topicUtil';

const localMessages = {
  helpTitle: { id: 'media.words.help.title', defaultMessage: 'About Media Top Words' },
  helpText: { id: 'media.words.help.into',
    defaultMessage: '<p>This is a visualization showing the top words used by this Media Source within the Topic.</p>',
  },
};

const WORD_CLOUD_DOM_ID = 'topic-summary-media-word-cloud';

const MediaWordsContainer = (props) => {
  const { topicInfo, words, topicId, mediaId, initSampleSize, onViewSampleSizeClick,
    filters, handleWordCloudClick } = props;
  const { formatMessage } = props.intl;
  const urlDownload = `/api/topics/${topicId}/words.csv?${filtersAsUrlParams({ ...filters, q: combineQueryParams(filters.q, `media_id:${mediaId}`) })}`;
  return (
    <EditableWordCloudDataCard
      width={700}
      words={words}
      explore={filteredLinkTo(`/topics/${topicId}/words`, filters)}
      initSampleSize={initSampleSize}
      downloadUrl={urlDownload}
      onViewModeClick={word => handleWordCloudClick(word, topicId, filters)}
      onViewSampleSizeClick={onViewSampleSizeClick}
      title={formatMessage(messages.topWords)}
      domId={WORD_CLOUD_DOM_ID}
      svgDownloadPrefix={`${topicDownloadFilename(topicInfo.name, filters)}-media-${mediaId}-words`}
      includeTopicWord2Vec
    />
  );
};

MediaWordsContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
  onViewSampleSizeClick: PropTypes.func.isRequired,
  initSampleSize: PropTypes.string.isRequired,
  filters: PropTypes.object.isRequired,
  // from parent
  mediaId: PropTypes.number.isRequired,
  topicId: PropTypes.number.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  topicInfo: PropTypes.object,
  words: PropTypes.array,
  // from dispatch
  handleWordCloudClick: PropTypes.func,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.mediaSource.words.fetchStatus,
  topicInfo: state.topics.selected.info,
  words: state.topics.selected.mediaSource.words.list,
});

const mapDispatchToProps = dispatch => ({
  handleWordCloudClick: (word, topicId, filters) => {
    const params = generateParamStr({ ...filters, stem: word.stem, term: word.term });
    const url = `/topics/${topicId}/words/${word.stem}*?${params}`;
    dispatch(push(url));
  },
});

const fetchAsyncData = (dispatch, props) => {
  const filterObj = mergeFilters(props, `media_id:${props.mediaId}`);
  dispatch(fetchTopicTopWords(props.topicId, filterObj));
};

const handleSampleSizeChange = (dispatch, props, sampleSize) => {
  fetchAsyncData(dispatch, { ...props, sample_size: sampleSize });
};

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withHelp(localMessages.helpTitle, [localMessages.helpText, messages.wordCloudTopicWord2VecLayoutHelp])(
      withSampleSize(
        withCsvDownloadNotifyContainer(
          withFilteredAsyncData(fetchAsyncData)(
            MediaWordsContainer
          )
        ),
        handleSampleSizeChange, // tell it to run the fetch when the sample size changes too
      )
    )
  )
);
