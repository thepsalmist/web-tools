import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import slugify from 'slugify';
import withSampleSize from '../../common/composers/SampleSize';
import withCsvDownloadNotifyContainer from '../../common/hocs/CsvDownloadNotifyContainer';
import { fetchTopicTopWords } from '../../../actions/topicActions';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import withHelp from '../../common/hocs/HelpfulContainer';
import EditableWordCloudDataCard from '../../common/EditableWordCloudDataCard';
import { filteredLinkTo, filtersAsUrlParams, combineQueryParams } from '../../util/location';
import messages from '../../../resources/messages';
import { generateParamStr } from '../../../lib/apiUtil';
import { VIEW_1K, mergeFilters } from '../../../lib/topicFilterUtil';
import { topicDownloadFilename } from '../../util/topicUtil';

const localMessages = {
  helpTitle: { id: 'word.words.help.title', defaultMessage: 'About Word Top Words' },
  helpText: { id: 'word.words.help.into',
    defaultMessage: '<p>This is a visualization showing the top words associated with this word.  Click a word to jump to a page about how it is used.</p>',
  },
};

const WORD_CLOUD_DOM_ID = 'word-cloud';

class WordWordsContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { fetchData, filters } = this.props;
    if (nextProps.filters !== filters || (nextProps.stem !== this.props.stem || nextProps.term !== this.props.term)) {
      fetchData(nextProps);
    }
  }

  render() {
    const { topicInfo, filters, term, handleWordCloudClick, initSampleSize, onViewSampleSizeClick } = this.props;
    const { formatMessage } = this.props.intl;
    const urlDownload = `/api/topics/${topicInfo.topics_id}/words.csv?${filtersAsUrlParams({ ...filters, q: combineQueryParams(filters.q, `${term}*`) })}`;
    return (
      <EditableWordCloudDataCard
        words={this.props.words}
        explore={filteredLinkTo(`/topics/${topicInfo.topics_id}/words`, filters)}
        initSampleSize={initSampleSize}
        downloadUrl={urlDownload}
        onViewModeClick={handleWordCloudClick}
        onViewSampleSizeClick={onViewSampleSizeClick}
        title={formatMessage(messages.topWords)}
        domId={WORD_CLOUD_DOM_ID}
        svgDownloadPrefix={`${topicDownloadFilename(topicInfo.name, filters)}-word-${slugify(term)}--words`}
        includeTopicWord2Vec
      />
    );
  }
}

WordWordsContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
  onViewSampleSizeClick: PropTypes.func.isRequired,
  initSampleSize: PropTypes.string.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  topicName: PropTypes.string.isRequired,
  filters: PropTypes.object.isRequired,
  term: PropTypes.string.isRequired,
  stem: PropTypes.string.isRequired,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  asyncFetch: PropTypes.func.isRequired,
  handleWordCloudClick: PropTypes.func,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  words: PropTypes.array.isRequired,
  topicInfo: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.word.words.fetchStatus,
  topicInfo: state.topics.selected.info,
  words: state.topics.selected.word.words.list,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    const filterObj = mergeFilters(ownProps, `${ownProps.stem}*`, { sample_size: VIEW_1K });
    dispatch(fetchTopicTopWords(ownProps.topicId, filterObj));
  },
  fetchData: (props) => {
    const currentProps = props || ownProps;
    const filterObj = mergeFilters(currentProps, `${ownProps.stem}*`);
    dispatch(fetchTopicTopWords(ownProps.topicId, filterObj));
  },
  handleWordCloudClick: (word) => {
    const params = generateParamStr({ ...ownProps.filters, stem: word.stem, term: word.term });
    const url = `/topics/${ownProps.topicId}/words/${word.term}*?${params}`;
    dispatch(push(url));
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withHelp(localMessages.helpTitle, [localMessages.helpText, messages.wordCloudTopicWord2VecLayoutHelp])(
      withSampleSize(
        withAsyncFetch(
          withCsvDownloadNotifyContainer(
            WordWordsContainer
          )
        )
      )
    )
  )
);
