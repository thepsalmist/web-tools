import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { fetchTopicSimilarWords } from '../../../actions/topicActions';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import WordSimilarWords from './WordSimilarWords';

class WordSimilarWordsContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { fetchData, filters, stem } = this.props;
    if ((nextProps.filters !== filters) || (nextProps.stem !== stem)) {
      fetchData(nextProps.filters, nextProps.stem);
    }
  }

  render() {
    const { term, similarWords } = this.props;
    return <WordSimilarWords word={term} similarWords={similarWords} />;
  }
}

WordSimilarWordsContainer.propTypes = {
  // from composition chain
  intl: PropTypes.object.isRequired,
  // from parent
  term: PropTypes.string.isRequired,
  stem: PropTypes.string.isRequired,
  topicId: PropTypes.number.isRequired,
  filters: PropTypes.object.isRequired,
  // from mergeProps
  asyncFetch: PropTypes.func.isRequired,
  // from fetchData
  fetchData: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  similarWords: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.word.stories.fetchStatus,
  similarWords: state.topics.selected.word.similarWords.words,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (filters, stem) => {
    dispatch(fetchTopicSimilarWords(ownProps.topicId, stem, filters));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.filters, ownProps.stem);
    },
  });
}

export default
connect(mapStateToProps, mapDispatchToProps, mergeProps)(
  withAsyncFetch(
    WordSimilarWordsContainer
  )
);
