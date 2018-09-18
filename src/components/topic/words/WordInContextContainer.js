import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import slugify from 'slugify';
import { fetchWordSampleSentences } from '../../../actions/topicActions';
import withHelp from '../../common/hocs/HelpfulContainer';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import DataCard from '../../common/DataCard';
import WordTree from '../../vis/WordTree';
import messages from '../../../resources/messages';
import { downloadSvg } from '../../util/svg';
import { DownloadButton } from '../../common/IconButton';
import { topicDownloadFilename } from '../../util/topicUtil';

const localMessages = {
  title: { id: 'word.inContext.title', defaultMessage: 'Word in Context: {word}' },
  helpTitle: { id: 'word.inContext.help.title', defaultMessage: 'About Word in Context' },
  helpText: { id: 'word.inContext.help.text',
    defaultMessage: '<p>It is helpful to look at how a word is used, in addition to the fact that it is used.  While a word cloud can tell you what words are used, this interactive visualization can help you explore the use of a word in context.</p>',
  },
};

class WordInContextContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { fetchData, filters } = this.props;
    if (nextProps.filters !== filters || (nextProps.stem !== this.props.stem)) {
      fetchData(nextProps);
    }
  }

  getUniqueDomId = () => {
    const { topicId } = this.props;
    return `word-in-context-${topicId}`;
  }

  handleDownloadSvg = () => {
    const { topicName, filters, term } = this.props;
    // a little crazy, but it works (we have to just walk the DOM rendered by the library we are using)
    const domId = this.getUniqueDomId();
    const svgNode = document.getElementById(domId).children[0].children[0].children[0].children[0];
    const svgDownloadPrefix = `${topicDownloadFilename(topicName, filters)}-${slugify(term)}-in-context`;
    downloadSvg(svgDownloadPrefix, svgNode);
  }

  render() {
    const { term, fragments, helpButton } = this.props;
    const { formatMessage } = this.props.intl;
    const uniqueDomId = this.getUniqueDomId();
    return (
      <DataCard>
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.downloadSVG)} onClick={this.handleDownloadSvg} />
        </div>
        <h2>
          <FormattedMessage {...localMessages.title} values={{ word: term }} />
          {helpButton}
        </h2>
        <WordTree
          domId={uniqueDomId}
          sentences={fragments}
          startWord={term}
          height="400px"
        />
      </DataCard>
    );
  }
}

WordInContextContainer.propTypes = {
  // from parent
  stem: PropTypes.string.isRequired,
  term: PropTypes.string.isRequired,
  topicId: PropTypes.number.isRequired,
  topicName: PropTypes.string.isRequired,
  filters: PropTypes.object.isRequired,
  // from store
  fragments: PropTypes.array.isRequired,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  // from context
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
};


const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.word.sampleSentences.fetchStatus,
  fragments: state.topics.selected.word.sampleSentences.fragments,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (props) => {
    dispatch(fetchWordSampleSentences(props.topicId, props.term, props.filters));
  },
  asyncFetch: () => {
    dispatch(fetchWordSampleSentences(ownProps.topicId, ownProps.term, ownProps.filters));
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withHelp(localMessages.helpTitle, [localMessages.helpText, messages.wordTreeHelpText])(
      withAsyncFetch(
        WordInContextContainer
      )
    )
  )
);
