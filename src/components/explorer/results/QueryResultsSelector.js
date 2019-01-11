import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import TabSelector from '../../common/TabSelector';
import { queryChangedEnoughToUpdate, ensureSafeResults, ensureSafeTabIndex, ensureSafeSortedQueries } from '../../../lib/explorerUtil';

function withQueryResults(ChildComponent) {
  class QueryResultsSelector extends React.Component {
    state = {
      selectedQueryUid: 0,
      selectedQueryTabIndex: 0,
    };

    componentWillReceiveProps(nextProps) {
      const { lastSearchTime, fetchData } = this.props;
      if (nextProps.lastSearchTime !== lastSearchTime) {
        fetchData(nextProps.queries);
      }
    }

    shouldComponentUpdate(nextProps) {
      const { results, queries, shouldUpdate } = this.props;
      // ask the child if internal repainting is needed
      const defaultShouldUpdate = queryChangedEnoughToUpdate(queries, nextProps.queries, results, nextProps.results);
      const tabIndexNotValid = (nextProps.queries.length - 1) < this.state.selectedQueryTabIndex;
      if (tabIndexNotValid) {
        this.setState({ selectedQueryTabIndex: nextProps.queries.length - 1 });
      }
      const childShouldUpdate = (shouldUpdate && shouldUpdate(nextProps));
      return childShouldUpdate || defaultShouldUpdate;
    }

    getUidFromTabSelection(idx) {
      const { queries } = this.props;
      const selectedQuery = queries.sort((a, b) => a.sortPosition - b.sortPosition)[idx];
      this.setState({ selectedQueryTabIndex: idx, selectedQueryUid: selectedQuery.uid });
      this.forceUpdate();
    }

    render() {
      const { queries, results } = this.props;
      // remove deleted stuff and sort queries and results correctly before sending down to child
      const sortedSafeQueries = ensureSafeSortedQueries(queries);
      const safeResults = ensureSafeResults(sortedSafeQueries, results);
      const safeIndex = ensureSafeTabIndex(sortedSafeQueries, this.state.selectedQueryTabIndex);
      const tabSelector = <TabSelector onViewSelected={idx => this.getUidFromTabSelection(idx)} tabLabels={sortedSafeQueries} />;
      return (
        <div className="query-results-selector">
          <ChildComponent
            {...this.props}
            safeSortedQueries={sortedSafeQueries}
            results={safeResults}
            selectedTabIndex={safeIndex}
            selectedQueryUid={this.state.selectedQueryUid}
            selectedQuery={sortedSafeQueries[safeIndex]}
            tabSelector={tabSelector}
          />
        </div>
      );
    }
  }

  QueryResultsSelector.propTypes = {
    intl: PropTypes.object.isRequired,
    location: PropTypes.object,
    // from store
    isLoggedIn: PropTypes.bool.isRequired,
    fetchStatus: PropTypes.string.isRequired,
    results: PropTypes.array,
    queries: PropTypes.array,
    lastSearchTime: PropTypes.number,
    // dispatch
    fetchData: PropTypes.func.isRequired,
    // from children
    shouldUpdate: PropTypes.func,
    internalItemSelected: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.number,
    ]),
  };

  return injectIntl(
    QueryResultsSelector
  );
}

export default withQueryResults;
