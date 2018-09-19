import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import { selectComparativeWordField, updateQuery } from '../../../actions/explorerActions';
import { queryChangedEnoughToUpdate } from '../../../lib/explorerUtil';
import { getBrandDarkColor } from '../../../styles/colors';
import ComparativeOrderedWordCloud from '../../vis/ComparativeOrderedWordCloud';
import OrderedWordCloud from '../../vis/OrderedWordCloud';
import WordSelectWrapper from './WordSelectWrapper';

const localMessages = {
  title: { id: 'explorer.comparativeWords.title', defaultMessage: 'Compare Top Words' },
  intro: { id: 'explorer.comparativeWords.intro', defaultMessage: ' These words are the most used in each query. They are sized according to total count across all words in ...' },
  centerTitle: { id: 'explorer.comparativeWords.center', defaultMessage: 'Word used in both' },
  sideTitle: { id: 'explorer.comparativeWords.right', defaultMessage: 'Words unique to {name} in the top 100 words in the sampled stories' },
  downloadCsv: { id: 'explorer.entities.downloadCsv', defaultMessage: 'Download { name } word count comparison CSV' },

};
const LEFT = 0;
const RIGHT = 1;

class QueryWordComparisonResultsContainer extends React.Component {
  componentWillMount() {
    const { queries, selectComparativeWords, leftQuery } = this.props;
    const leftQ = queries[0];
    const rightQ = queries.length > 1 ? queries[1] : queries[0];
    if (leftQuery === null) {
      selectComparativeWords(leftQ, LEFT); // default selection. we can't do this if the user has set the UI widget
      selectComparativeWords(rightQ, RIGHT);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { lastSearchTime, selectComparativeWords, leftQuery, rightQuery } = this.props;
    let leftQ = null;
    let rightQ = null;
    if (nextProps.lastSearchTime !== lastSearchTime) {
      // if a search query change from the top
      const { temp } = nextProps.queries[0];
      leftQ = temp;
      rightQ = nextProps.queries.length > 1 ? nextProps.queries[1] : nextProps.queries[0];
      selectComparativeWords(leftQ, LEFT);
      selectComparativeWords(rightQ, RIGHT);
    } else if ((nextProps.leftQuery && nextProps.leftQuery !== leftQuery)
      || (nextProps.rightQuery && nextProps.rightQuery !== rightQuery)) {
      // if a change in the comparison UI selection
      leftQ = nextProps.leftQuery;
      rightQ = nextProps.rightQuery;
      selectComparativeWords(leftQ, LEFT);
      selectComparativeWords(rightQ, RIGHT);
    }
  }

  shouldComponentUpdate(nextProps) {
    const { results, queries, leftQuery, rightQuery } = this.props;
    const shouldChange = queryChangedEnoughToUpdate(queries, nextProps.queries, results, nextProps.results);
    // also check if they changed their view choices
    return (shouldChange || (nextProps.leftQuery !== leftQuery || nextProps.rightQuery !== rightQuery)
    );
  }

  selectAndFetchComparedQueries = (queryObj, target) => {
    const { selectComparativeWords, leftQuery, rightQuery } = this.props;
    // don't let user set the dropdowns to the same value
    if (target === LEFT && queryObj !== rightQuery) {
      selectComparativeWords(queryObj, LEFT);
    } else if (target === RIGHT && queryObj !== leftQuery) {
      selectComparativeWords(queryObj, RIGHT);
    }
  }

  render() {
    const { queries, results, handleWordCloudClick, leftQuery, rightQuery } = this.props;
    if (results && !rightQuery) {
      return (
        <Grid>
          <Row>
            <Col lg={8}>
              <h2><FormattedMessage {...localMessages.title} /></h2>
              <OrderedWordCloud
                words={results[0].list}
                // alreadyNormalized
                width={700}
              />
            </Col>
          </Row>
        </Grid>
      );
    }
    if (results && results.length > 1) {
      let wordSelectorContent;
      if (queries.length > 2) {
        // only show selector if more than two queries
        wordSelectorContent = (
          <WordSelectWrapper
            queries={queries}
            selectComparativeWords={this.selectAndFetchComparedQueries}
            leftQuery={leftQuery}
            rightQuery={rightQuery}
          />
        );
      }
      return (
        <Grid>
          <Row>
            <Col lg={12}>
              <h2><FormattedMessage {...localMessages.title} /></h2>
              {wordSelectorContent}
              <ComparativeOrderedWordCloud
                leftWords={results[leftQuery.index].list}
                rightWords={results[rightQuery.index].list}
                leftTextColor={leftQuery.color}
                rightTextColor={rightQuery.color}
                textColor={getBrandDarkColor()}
                onWordClick={handleWordCloudClick}
                leftTitleMsg={<FormattedMessage {...localMessages.sideTitle} values={{ name: leftQuery.label }} />}
                centerTitleMsg={<FormattedMessage {...localMessages.centerTitle} />}
                rightTitleMsg={<FormattedMessage {...localMessages.sideTitle} values={{ name: rightQuery.label }} />}
              />
            </Col>
          </Row>
        </Grid>
      );
    }
    return <div>Error</div>;
  }
}

QueryWordComparisonResultsContainer.propTypes = {
  // from parent
  lastSearchTime: PropTypes.number.isRequired,
  queries: PropTypes.array.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  onQueryModificationRequested: PropTypes.func.isRequired,
  // from composition
  intl: PropTypes.object.isRequired,
  // from dispatch
  results: PropTypes.array.isRequired,
  // from mergeProps
  asyncFetch: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  handleWordCloudClick: PropTypes.func.isRequired,
  selectComparativeWords: PropTypes.func.isRequired,
  leftQuery: PropTypes.object,
  rightQuery: PropTypes.object,
};

const mapStateToProps = state => ({
  lastSearchTime: state.explorer.lastSearchTime.time,
  fetchStatus: state.explorer.topWords.fetchStatus,
  results: state.explorer.topWords.results,
  leftQuery: state.explorer.topWordsComparison.left,
  rightQuery: state.explorer.topWordsComparison.right,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  selectComparativeWords: (query, target) => {
    dispatch(selectComparativeWordField({ query, target }));
  },
  updateCurrentQuery: (query, fieldName) => {
    if (query) {
      dispatch(updateQuery({ query, fieldName }));
    }
  },
  handleWordCloudClick: (word) => {
    ownProps.onQueryModificationRequested(word.term);
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.selectComparativeWords(ownProps.queries[0], LEFT);
      if (ownProps.queries[1] && ownProps.queries[1].q !== '*') {
        dispatchProps.selectComparativeWords(ownProps.queries[1], RIGHT);
      }
    },
  });
}

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    withAsyncFetch(
      QueryWordComparisonResultsContainer
    )
  )
);
