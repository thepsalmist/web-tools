import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { connect } from 'react-redux';
import FocusSelectorContainer from './FocusSelectorContainer';
import QuerySelectorContainer from './QuerySelectorContainer';

/**
 * As the parent of other filters, it is useful for this one to own the snapshot selection process,
 * mostly so that heppens first before other things render.
 */
const FilterSelectorContainer = (props) => {
  const { filters, topicId, snapshotId, filtersVisible, location,
    onFocusSelected, onQuerySelected } = props;
  return (filtersVisible && (
    <div className="filter">
      <Grid>
        <Row className="filter-selector">
          <Col lg={5}>
            {snapshotId && (
              <FocusSelectorContainer
                topicId={topicId}
                location={location}
                snapshotId={filters.snapshotId}
                onFocusSelected={onFocusSelected}
              />
            )}
          </Col>
          <Col lg={1} />
          <Col lg={5}>
            <QuerySelectorContainer
              topicId={topicId}
              onQuerySelected={onQuerySelected}
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
  // from state
  filters: PropTypes.object.isRequired,
  topicId: PropTypes.number.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  snapshotId: PropTypes.number,
  filtersVisible: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  filters: state.topics.selected.filters,
  filtersVisible: state.topics.selected.filtersVisible,
  topicId: state.topics.selected.id,
  fetchStatus: state.topics.selected.snapshots.fetchStatus,
  snapshotId: state.topics.selected.filters.snapshotId,
});

export default
injectIntl(
  connect(mapStateToProps)(
    FilterSelectorContainer
  )
);
