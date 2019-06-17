import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withHelp from '../../common/hocs/HelpfulContainer';
import FocusSelector from './FocusSelector';

const localMessages = {
  title: { id: 'subtopic.title', defaultMessage: 'Subtopic' },
  helpTitle: { id: 'subtopic.help.title', defaultMessage: 'About Subtopic' },
  helpText: { id: 'subtopic.help.text',
    defaultMessage: '<p>subtopic info .</p>',
  },
  close: { id: 'subtopic.close', defaultMessage: 'Close' },
};

const FocusSelectorContainer = (props) => {
  const { foci, selectedFocus, onFocusSelected, helpButton } = props;
  return (
    <span>
      <FocusSelector
        selectedId={(selectedFocus) ? selectedFocus.foci_id : null}
        foci={foci}
        onFocusSelected={onFocusSelected}
      />
      {helpButton}
    </span>
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
  helpButton: PropTypes.node.isRequired,
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
    withHelp(localMessages.helpTitle, localMessages.helpText)(
      FocusSelectorContainer
    )
  )
);
