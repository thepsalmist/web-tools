import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import withSummary from '../../common/hocs/SummarizedVizualization';
import LinkWithFilters from '../LinkWithFilters';
import { fetchTopicMapFiles } from '../../../actions/topicActions';

const localMessages = {
  title: { id: 'topic.summary.mapDownload.title', defaultMessage: 'Download Link and Word Maps' },
  helpIntro: { id: 'topic.summary.mapDownload.help.intro', defaultMessage: '<p>Anayzing the content in this topic as a network can help reveal clusters of content all using the same narrative.  Links Maps show which media sources are linking to each other.  Word Maps show which sources use the same words when talking about this topic.' },
  helpText: { id: 'topic.summary.mapDownload.help.details', defaultMessage: '<p>When you visit this page for the first time, we start a background process to generate the word map.  This word map is based on the top 100 words from the top 50 sources.  We will be making this system more versatile in the future, but for now this was the quickest way to integrate support.  The map is unique for each snapshot/focus/timespan trio; so if you change to a different timespan a new map will be generated.  These maps are saved, so you won\'t have to generate them more than once.</p>' },
  generating: { id: 'topic.summary.mapDownload.generating', defaultMessage: 'Your map is being generated. This can take a while. Please reload this page in a few minutes to see if it is ready.' },
  unknownStatus: { id: 'topic.summary.mapDownload.unknownStatus', defaultMessage: 'We\'re not sure what is up with this file. Sorry!' },
  downloadText: { id: 'topic.summary.mapDownload.download.text', defaultMessage: 'Download a text file of the words used by each source' },
  downloadGexf: { id: 'topic.summary.mapDownload.download.gexf', defaultMessage: 'Download a .gexf file to use in Gephi' },
  downloadJson: { id: 'topic.summary.mapDownload.download.json', defaultMessage: 'Download a .json file to analyze with Python' },
  wordMap: { id: 'topic.summary.mapDownload.wordMap.header', defaultMessage: 'Word Map' },
  linkMap: { id: 'topic.summary.mapDownload.linkMap.header', defaultMessage: 'Link Map' },
  linkMapDownload: { id: 'topic.summary.mapDownload.linkMap.download', defaultMessage: 'Generate a .gexf link map.' },
  unsupported: { id: 'topic.summary.mapDownload.unsupported', defaultMessage: 'Sorry, but we can\'t generate link maps or word maps when you are using a query filter.  Remove your "{q}" query filter if you want to generate these maps.' },
};

class DownloadMapContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { filters, fetchData } = this.props;
    if (nextProps.filters !== filters) {
      fetchData(nextProps);
    }
  }
  render() {
    const { topicId, filters, wordMapStatus } = this.props;
    let content;
    if (filters.q) {
      // maps generated with a q filter are not what people expect them to be, so don't support it
      content = (<FormattedMessage {...localMessages.unsupported} values={{ q: filters.q }} />);
    } else {
      let wordMapContent;
      switch (wordMapStatus) {
        case 'generating':
          wordMapContent = <FormattedMessage {...localMessages.generating} />;
          break;
        case 'rendered':
          wordMapContent = (
            <ul>
              <li>
                <a href={`/api/topics/${topicId}/map-files/wordMap.gexf?timespanId=${filters.timespanId}`}>
                  <FormattedMessage {...localMessages.downloadGexf} />
                </a>
              </li>
              <li>
                <a href={`/api/topics/${topicId}/map-files/wordMap.json?timespanId=${filters.timespanId}`}>
                  <FormattedMessage {...localMessages.downloadJson} />
                </a>
              </li>
              <li>
                <a href={`/api/topics/${topicId}/map-files/wordMap.txt?timespanId=${filters.timespanId}`}>
                  <FormattedMessage {...localMessages.downloadText} />
                </a>
              </li>
            </ul>
          );
          break;
        default:

      }
      content = (
        <React.Fragment>
          <h3><FormattedMessage {...localMessages.linkMap} />:</h3>
          <p><LinkWithFilters to={`/topics/${topicId}/link-map`} ><FormattedMessage {...localMessages.linkMapDownload} /></LinkWithFilters></p>
          <h3><FormattedMessage {...localMessages.wordMap} />:</h3>
          {wordMapContent}
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        {content}
      </React.Fragment>
    );
  }
}

DownloadMapContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  filters: PropTypes.object.isRequired,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  linkMapStatus: PropTypes.string,
  wordMapStatus: PropTypes.string,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.summary.mapFiles.fetchStatus,
  linkMapStatus: state.topics.selected.summary.mapFiles.linkMap,
  wordMapStatus: state.topics.selected.summary.mapFiles.wordMap,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (props) => {
    dispatch(fetchTopicMapFiles(props.topicId, props.filters));
  },
  asyncFetch: () => {
    dispatch(fetchTopicMapFiles(ownProps.topicId, ownProps.filters));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      withSummary(localMessages.title, localMessages.helpIntro, localMessages.helpText)(
        withAsyncFetch(
          DownloadMapContainer
        )
      )
    )
  );
