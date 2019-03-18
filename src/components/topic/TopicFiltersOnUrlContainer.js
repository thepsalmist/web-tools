import PropTypes from 'prop-types';
import React from 'react';
// import { push } from 'react-router-redux';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import LoadingSpinner from '../common/LoadingSpinner';
// import withAsyncData from '../common/hocs/AsyncDataContainer';
import { filterBySnapshot, filterByFocus, filterByTimespan, filterByQuery } from '../../actions/topicActions';
// import { emptyString } from '../../lib/formValidators';

const withTopicFiltersOnUrl = (ChildComponent) => {
  class TopicFiltersOnUrlContainer extends React.Component {
    componentDidMount() {
      const { location, parseFiltersFromUrl, setDefaultFiltersAsNeeded } = this.props;
      const filtersOnUrl = parseFiltersFromUrl(location);
      setDefaultFiltersAsNeeded(filtersOnUrl);
    }

    render() {
      const { filters } = this.props;
      if (filters.snapshotId && filters.timespanId) {
        return <ChildComponent filters={filters} />;
      }
      return <LoadingSpinner />;
    }
  }

  TopicFiltersOnUrlContainer.propTypes = {
    // from compositional chain
    intl: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    // from store
    filters: PropTypes.object.isRequired,
    // from dispatch
    parseFiltersFromUrl: PropTypes.func.isRequired,
    setDefaultFiltersAsNeeded: PropTypes.func.isRequired,
  };

  const mapStateToProps = state => ({
    filters: state.topics.selected.filters,
  });

  const mapDispatchToProps = dispatch => ({
    parseFiltersFromUrl: (location) => {
      // naively parse filters from URL and save them to store as is
      if (location.query.snapshotId) {
        dispatch(filterBySnapshot(location.query.snapshotId));
      }
      if (location.query.focusId) {
        dispatch(filterByFocus(location.query.focusId));
      }
      if (location.query.timespanId) {
        dispatch(filterByTimespan(location.query.timespanId));
      }
      if (location.query.q) {
        dispatch(filterByQuery(location.query.q));
      }
      return {
        snapshotId: location.query.snapshotId,
        timespanId: location.query.timespanId,
        focusId: location.query.focusId,
        q: location.query.q,
      };
    },
    setDefaultFiltersAsNeeded: (filtersFromUrl) => {
      // check what the URL filters were and default any as needed
      console.log(filtersFromUrl);
      /*
      // if no snapshot specified, pick the latest usable snapshot
      if (emptyString(filtersFromUrl.snapshotId)) {
        // default to the latest snapshot if none is specified on url (no matter the state of it)
        if (topicVersionInfo.versionList.length > 0) {
          const firstSnapshot = topicVersionInfo.versionList[0];
          const latestSnapshotId = topicVersionInfo.lastReadySnapshot ? topicVersionInfo.lastReadySnapshot.snapshots_id : firstSnapshot.snapshots_id;
          const newLocation = filteredLocation(location, {
            snapshotId: latestSnapshotId,
            timespanId: null,
            focusId: null,
            q: null,
          });
          dispatch(replace(newLocation)); // do a replace, not a push here so the non-snapshot url isn't in the history
          dispatch(filterBySnapshot(latestSnapshotId));
        }

        // if nothing is ready/usable, put up a notice
        if (!topicVersionInfo.lastReadySnapshot) {
          dispatch(addNotice({
            level: LEVEL_INFO,
            message: intl.formatMessage(localMessages.snapshotImporting),
          }));
        }
      } else if ((topicVersionInfo.lastReadySnapshot
          && topicVersionInfo.lastReadySnapshot.snapshots_id !== parseInt(filters.snapshotId, 10))
          || topicVersionInfo.versionList.length !== getCurrentVersionFromSnapshot(topicInfo, filters.snapshotId)) {
        // if snaphot is specific in URL, but it is not the latest then show a warning
        dispatch(addNotice({
          level: LEVEL_WARNING,
          htmlMessage: intl.formatHTMLMessage(localMessages.notUsingLatestSnapshot, {
            url: urlWithFilters(location.pathname, {
              snapshotId: filters.snapshotId,
            }),
          }),
        }));
      }
      */
    },
  });

  // const fetchAsyncData = dispatch => dispatch(fetchSampleSearches()); // inefficient: we need the sample searches loaded just in case

  return injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      // withAsyncData(fetchAsyncData)(
      TopicFiltersOnUrlContainer
      // )
    )
  );
};

export default withTopicFiltersOnUrl;
