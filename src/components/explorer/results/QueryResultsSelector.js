import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import TabSelector from '../../common/TabSelector';
import { queryChangedEnoughToUpdate, ensureSafeResults, ensureSafeTabIndex } from '../../../lib/explorerUtil';

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
      return childShouldUpdate || defaultShouldUpdate || tabIndexNotValid;
    }

    getUidFromTabSelection(idx) {
      const { queries } = this.props;
      const selectedQuery = queries.sort((a, b) => a.sortPosition - b.sortPosition)[idx];
      this.setState({ selectedQueryTabIndex: idx, selectedQueryUid: selectedQuery.uid });
      this.forceUpdate();
    }

    render() {
      const { queries, results } = this.props;
      const sortedQueries = queries.sort((a, b) => a.sortPosition - b.sortPosition);
      const safeResults = ensureSafeResults(queries, results);
      const safeIndex = ensureSafeTabIndex(queries, this.state.selectedQueryTabIndex);
      const tabSelector = <TabSelector onViewSelected={idx => this.getUidFromTabSelection(idx)} tabLabels={sortedQueries} />;
      return (
        <div className="query-results-selector">
          <ChildComponent
            {...this.props}
            results={safeResults}
            selectedTabIndex={this.state.selectedQueryTabIndex} // for backwards compatability
            selectedQueryUid={this.state.selectedQueryUid}
            selectedQuery={sortedQueries[safeIndex]}
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
