import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { updateTimestampForQueries, resetSelected, resetSentenceCounts, resetSampleStories, resetStoryCounts, resetGeo, selectQuery, removeDeletedQueries } from '../../../actions/explorerActions';
import { resetStory } from '../../../actions/storyActions';
import QueryBuilderContainer from './QueryBuilderContainer';
import QueryResultsContainer from '../results/QueryResultsContainer';
import composeUrlBasedQueryContainer from '../UrlBasedQueryContainer';

class LoggedInQueryContainer extends React.Component {
  componentWillMount() {
    const { selectFirstQuery, queries } = this.props;
    // console.log(queries[0]);
    selectFirstQuery(queries[0]); // on first load select first by default so the builder knows which one to render in the form
  }

  componentWillUnmount() {
    const { resetExplorerData } = this.props;
    resetExplorerData();
  }

  render() {
    const { queries, handleSearch, samples, location, lastSearchTime } = this.props;
    const isEditable = false;
    return (
      <div className="query-container query-container-logged-in">
        <QueryBuilderContainer isEditable={isEditable} onSearch={() => handleSearch()} />
        <QueryResultsContainer
          lastSearchTime={lastSearchTime}
          queries={queries}
          params={location}
          samples={samples}
          onSearch={() => handleSearch()}
        />
      </div>
    );
  }
}

LoggedInQueryContainer.propTypes = {
  intl: PropTypes.object.isRequired,
  // from parent
  initialValues: PropTypes.object,
  // from state
  selected: PropTypes.object,
  queries: PropTypes.array,
  samples: PropTypes.array,
  query: PropTypes.object,
  location: PropTypes.object,
  // from dispatch
  resetExplorerData: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  lastSearchTime: PropTypes.number,
  // from dispath
  selectFirstQuery: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  selected: state.explorer.selected,
  selectedQuery: state.explorer.selected,
  queries: state.explorer.queries.queries,
  lastSearchTime: state.explorer.lastSearchTime.time,
  samples: state.explorer.samples.list,
});

// push any updates (including selected) into queries in state, will trigger async load in sub sections
const mapDispatchToProps = dispatch => ({
  resetExplorerData: () => { // TODO we will reduce this down to one call
    dispatch(resetSelected());
    // dispatch(resetQueries());
    dispatch(resetSentenceCounts());
    dispatch(resetSampleStories());
    dispatch(resetStory());
    dispatch(resetStoryCounts());
    dispatch(resetGeo());
  },
  reallyHandleSearch: () => {
    dispatch(removeDeletedQueries());
    dispatch(updateTimestampForQueries()); // but this doesn't update the query... only the timestamp.. nextprops.queries should be new?
    // update URL location according to updated queries
  },
  selectFirstQuery: (query) => {
    dispatch(selectQuery(query));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    handleSearch: () => {
      dispatchProps.reallyHandleSearch(stateProps.queries);
    },
  });
}

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    composeUrlBasedQueryContainer()(
      LoggedInQueryContainer
    )
  )
);
