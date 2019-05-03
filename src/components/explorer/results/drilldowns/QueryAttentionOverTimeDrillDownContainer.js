import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { fetchQueryPerDateTopWords, fetchDemoQueryPerDateTopWords, fetchQueryPerDateSampleStories,
  fetchDemoQueryPerDateSampleStories, resetQueriesPerDateTopWords, resetQueriesPerDateSampleStories,
  resetSentenceDataPoint } from '../../../../actions/explorerActions';
import withAsyncData from '../../../common/hocs/AsyncDataContainer';
import QueryAttentionOverTimeDrillDownDataCard from './QueryAttentionOverTimeDrillDownDataCard';

class QueryAttentionOverTimeDrillDownContainer extends React.Component {
  constructor(props) {
    super(props);
    this.rootRef = React.createRef();
  }

  shouldComponentUpdate(nextProps) {
    const { dataPoint, lastSearchTime } = this.props;
    return (nextProps.lastSearchTime !== lastSearchTime || nextProps.dataPoint !== dataPoint);
  }

  componentDidUpdate(prevProps) {
    const { dataPoint } = this.props;
    const prevDataPoint = prevProps.dataPoint;
    const rootNode = this.rootRef;
    // have to treat this node carefully, because it might not be showing
    if (rootNode && rootNode.current && dataPoint && (dataPoint !== prevDataPoint)) {
      rootNode.current.scrollIntoView();
    }
  }

  render() {
    const { words, handleClose, stories, dataPoint } = this.props;
    let content = <span />;
    // don't bother if datapoint is empty
    // if (dataPoint && words && words.length > 0 && stories !== undefined) {
    if (dataPoint) {
      content = (
        <div className="drill-down" ref={this.rootRef}>
          <QueryAttentionOverTimeDrillDownDataCard
            info={dataPoint}
            words={words}
            stories={stories}
            onClose={handleClose}
          />
        </div>
      );
    }
    return content;
  }
}

QueryAttentionOverTimeDrillDownContainer.propTypes = {
  // from parent
  lastSearchTime: PropTypes.number.isRequired,
  // from composition
  intl: PropTypes.object.isRequired,
  // from dispatch
  handleClose: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.array.isRequired,
  dataPoint: PropTypes.object,
  words: PropTypes.array,
  stories: PropTypes.array,
};

const mapStateToProps = state => ({
  fetchStatus: [state.explorer.storiesPerDateRange.fetchStatus, state.explorer.topWordsPerDateRange.fetchStatus],
  dataPoint: state.explorer.storySplitCount.dataPoint,
  words: state.explorer.topWordsPerDateRange.results,
  stories: state.explorer.storiesPerDateRange.results,
});

const mapDispatchToProps = dispatch => ({
  handleClose: () => {
    dispatch(resetSentenceDataPoint());
    dispatch(resetQueriesPerDateSampleStories());
    dispatch(resetQueriesPerDateTopWords());
  },
});

const fetchAsyncData = (dispatch, { isLoggedIn, dataPoint }) => {
  // this should trigger when the user clicks a data point on the attention over time chart
  dispatch(resetQueriesPerDateSampleStories());
  dispatch(resetQueriesPerDateTopWords());
  if (dataPoint) {
    if (isLoggedIn) {
      dispatch(fetchQueryPerDateSampleStories({ ...dataPoint }));
      dispatch(fetchQueryPerDateTopWords({ ...dataPoint }));
    } else {
      dispatch(fetchDemoQueryPerDateTopWords(dataPoint));
      dispatch(fetchDemoQueryPerDateSampleStories(dataPoint));
    }
  }
};

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withAsyncData(fetchAsyncData, ['dataPoint'])(
      QueryAttentionOverTimeDrillDownContainer
    )
  )
);
