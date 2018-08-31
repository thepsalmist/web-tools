import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import FocusSelectorContainer from './FocusSelectorContainer';
import { filterBySnapshot } from '../../../actions/topicActions';
import { filteredLocation } from '../../util/location';
import SnapshotSelector from './SnapshotSelector';
import QuerySelectorContainer from './QuerySelectorContainer';

/**
 * As the parent of other filters, it is useful for this one to own the snapshot selection process,
 * mostly so that heppens first before other things render.
 */
const FilterSelectorContainer = (props) => {
  const { filters, topicId, filtersVisible, snapshotId, snapshots, location, handleSnapshotSelected,
          onFocusSelected, onQuerySelected } = props;
  return (filtersVisible && (
    <div className="filter">
      <Grid>
        <Row className="filter-selector">
          <Col lg={4}>
            {snapshotId && (
              <FocusSelectorContainer
                topicId={topicId}
                location={location}
                snapshotId={filters.snapshotId}
                onFocusSelected={onFocusSelected}
              />
            )}
          </Col>
          <Col lg={5}>
            <QuerySelectorContainer
              topicId={topicId}
              onQuerySelected={onQuerySelected}
            />
          </Col>
          <Col lg={3}>
            <SnapshotSelector
              selectedId={snapshotId}
              snapshots={snapshots}
              onSnapshotSelected={handleSnapshotSelected}
            />
          </Col>
        </Row>
      </Grid>
    </div>
  ));
};

FilterSelectorContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  // from parent
  onFocusSelected: PropTypes.func.isRequired,
  onQuerySelected: PropTypes.func.isRequired,
  // from dispatch
  handleSnapshotSelected: PropTypes.func.isRequired,
  // from state
  filters: PropTypes.object.isRequired,
  topicId: PropTypes.number.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  snapshots: PropTypes.array.isRequired,
  snapshotId: PropTypes.number,
  filtersVisible: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  filters: state.topics.selected.filters,
  filtersVisible: state.topics.selected.filtersVisible,
  topicId: state.topics.selected.id,
  fetchStatus: state.topics.selected.snapshots.fetchStatus,
  snapshots: state.topics.selected.snapshots.list,
  snapshotId: state.topics.selected.filters.snapshotId,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSnapshotSelected: (snapshotId) => {
    const newLocation = filteredLocation(ownProps.location, {
      snapshots_id: snapshotId,
      timespanId: null,
      focusId: null,
    });
    dispatch(filterBySnapshot(snapshotId));
    dispatch(push(newLocation));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      FilterSelectorContainer
    )
  );
