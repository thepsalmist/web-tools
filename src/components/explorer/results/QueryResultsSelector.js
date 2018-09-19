import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import TabSelector from '../../common/TabSelector';
import { queryChangedEnoughToUpdate } from '../../../lib/explorerUtil';

function withQueryResults(ChildComponent) {
  class QueryResultsSelector extends React.Component {
    state = {
      selectedQueryIndex: 0,
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
      const childShouldUpdate = (shouldUpdate && shouldUpdate(nextProps));
      return childShouldUpdate || defaultShouldUpdate;
    }

    setView(nextView) {
      this.setState({ selectedQueryIndex: nextView });
      this.forceUpdate();
    }

    render() {
      const { queries } = this.props;
      const tabSelector = <TabSelector onViewSelected={idx => this.setView(idx)} tabLabels={queries} />;
      return (
        <div className="query-results-selector">
          <ChildComponent
            {...this.props}
            selectedTabIndex={this.state.selectedQueryIndex} // for backwards compatability
            selectedQueryIndex={this.state.selectedQueryIndex}
            selectedQuery={queries[this.state.selectedQueryIndex]}
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
