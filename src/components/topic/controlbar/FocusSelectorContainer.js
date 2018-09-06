import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import FocusSelector from './FocusSelector';

const FocusSelectorContainer = (props) => {
  const { foci, selectedFocus, onFocusSelected } = props;
  return (
    <FocusSelector
      selectedId={(selectedFocus) ? selectedFocus.foci_id : null}
      foci={foci}
      onFocusSelected={onFocusSelected}
    />
  );
};

FocusSelectorContainer.propTypes = {
  // from parent
  topicId: PropTypes.number.isRequired,
  location: PropTypes.object.isRequired,
  snapshotId: PropTypes.number,
  onFocusSelected: PropTypes.func.isRequired,
  // from composition
  intl: PropTypes.object.isRequired,
  // from state
  foci: PropTypes.array.isRequired,
  selectedFocus: PropTypes.object,
};

const mapStateToProps = state => ({
  foci: state.topics.selected.focalSets.foci.list,
  selectedFocus: state.topics.selected.focalSets.foci.selected,
});

export default
connect(mapStateToProps)(
  injectIntl(
    FocusSelectorContainer
  )
);
