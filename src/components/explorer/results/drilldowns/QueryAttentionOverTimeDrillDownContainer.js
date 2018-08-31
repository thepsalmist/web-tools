import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { fetchQueryPerDateTopWords, fetchDemoQueryPerDateTopWords, fetchQueryPerDateSampleStories,
  fetchDemoQueryPerDateSampleStories, resetQueriesPerDateTopWords, resetQueriesPerDateSampleStories,
  resetSentenceDataPoint } from '../../../../actions/explorerActions';
import withAsyncFetch from '../../../common/hocs/AsyncContainer';
import QueryAttentionOverTimeDrillDownDataCard from './QueryAttentionOverTimeDrillDownDataCard';
import LoadingSpinner from '../../../common/LoadingSpinner';

class QueryAttentionOverTimeDrillDownContainer extends React.Component {
  constructor(props) {
    super(props);
    this.rootRef = React.createRef();
  }
  state = {
    dateRange: null,
    clickedQuery: null,
  }
  componentWillReceiveProps(nextProps) {
    const { lastSearchTime, fetchData, dataPoint } = this.props;
    if ((nextProps.lastSearchTime !== lastSearchTime ||
      nextProps.dataPoint !== dataPoint) && nextProps.dataPoint !== null) {
      fetchData(nextProps.dataPoint);
    }
  }
  shouldComponentUpdate(nextProps) {
    const { dataPoint, words, stories } = this.props;
    return (nextProps.dataPoint !== dataPoint ||
      nextProps.words !== words ||
      nextProps.stories !== stories);
  }
  componentDidUpdate() {
    const rootNode = this.rootRef.current;
    rootNode.scrollIntoView();
  }
  render() {
    const { words, handleClose, stories, dataPoint } = this.props;

    let dateSelected = true;
    let content = <span />;
    // don't bother if datapoint is empty
    if (dataPoint && words && words.length > 0 && stories !== undefined) {
      content = (
        <QueryAttentionOverTimeDrillDownDataCard
          info={dataPoint}
          words={words}
          stories={stories}
          onClose={handleClose}
        />
      );
    } else if (dataPoint) {
      content = <LoadingSpinner />;
    } else {
      dateSelected = false;
    }

    if (dateSelected) {
      return (
        <div className="drill-down" ref={this.rootRef}>
          {content}
        </div>
      );
    }
    return content;
  }
}

QueryAttentionOverTimeDrillDownContainer.propTypes = {
  // from parent
  lastSearchTime: PropTypes.number.isRequired,
  queries: PropTypes.array.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  // from composition
  intl: PropTypes.object.isRequired,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  // from mergeProps
  asyncFetch: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  dataPoint: PropTypes.object,
  words: PropTypes.array,
  stories: PropTypes.array,
  results: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.explorer.storySplitCount.fetchStatus,
  dataPoint: state.explorer.storySplitCount.dataPoint,
  words: state.explorer.topWordsPerDateRange.list,
  stories: state.explorer.storiesPerDateRange.results,
  results: state.explorer.storySplitCount.results,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (clickedQuery) => {
    // this should trigger when the user clicks a data point on the attention over time chart
    dispatch(resetQueriesPerDateSampleStories());
    dispatch(resetQueriesPerDateTopWords());
    if (clickedQuery && clickedQuery !== undefined) {
      if (ownProps.isLoggedIn) {
        dispatch(fetchQueryPerDateSampleStories({ ...clickedQuery }));
        dispatch(fetchQueryPerDateTopWords({ ...clickedQuery }));
      } else {
        dispatch(fetchDemoQueryPerDateTopWords(clickedQuery));
        dispatch(fetchDemoQueryPerDateSampleStories(clickedQuery));
      }
    }
  },
  handleClose: () => {
    dispatch(resetSentenceDataPoint());
    dispatch(resetQueriesPerDateSampleStories());
    dispatch(resetQueriesPerDateTopWords());
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.dataPoint);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      withAsyncFetch(
        QueryAttentionOverTimeDrillDownContainer
      )
    )
  );
