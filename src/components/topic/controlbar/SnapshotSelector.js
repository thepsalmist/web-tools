/* eslint prefer-destructuring: 0 */

import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const localMessages = {
  pickSnapshot: { id: 'snapshot.pick', defaultMessage: 'Snapshot' },
  snapshotNotReady: { id: 'snapshot.notReady', defaultMessage: 'Not ready ({state})' },
};

class SnapshotSelector extends React.Component {
  handleSnapshotSelected = (snapshotsId) => {
    const { onSnapshotSelected, snapshots } = this.props;
    onSnapshotSelected(snapshots.find(s => s.snapshots_id === snapshotsId));
  }

  render() {
    const { snapshots, selectedId } = this.props;
    const { formatMessage, formatDate } = this.props.intl;
    // default to select first if you need to
    let selected = snapshots.find(snapshot => (snapshot.snapshots_id === selectedId));
    if (selected === null) {
      selected = snapshots[0];
    }
    return (
      <div className="snapshot-selector">
        <InputLabel><FormattedMessage {...localMessages.pickSnapshot} /></InputLabel>
        <Select
          label={formatMessage(localMessages.pickSnapshot)}
          style={{ color: 'rgb(224,224,224)', opacity: 0.8 }}
          underline={{ color: 'rgb(255,255,255)', opacity: 0.8 }}
          value={selectedId}
          fullWidth
          onChange={event => this.handleSnapshotSelected(event.target.value)}
        >
          {snapshots.map((snapshot) => {
            const formattedDateStr = formatDate(snapshot.snapshotDate, { month: 'short', year: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' });
            const stateMessage = (snapshot.isUsable) ? '' : `: ${formatMessage(localMessages.snapshotNotReady, { state: snapshot.state })}`;
            const noteMessage = (snapshot.note && snapshot.note.length > 0) ? `(${snapshot.note})` : '';
            return (
              <MenuItem
                disabled={!snapshot.isUsable}
                key={snapshot.snapshots_id}
                value={snapshot.snapshots_id}
              >
                {`${formattedDateStr} ${stateMessage} ${noteMessage}`}
              </MenuItem>
            );
          })}
        </Select>
      </div>
    );
  }
}

SnapshotSelector.propTypes = {
  snapshots: PropTypes.array.isRequired,
  selectedId: PropTypes.number,
  intl: PropTypes.object.isRequired,
  onSnapshotSelected: PropTypes.func,
};

export default
injectIntl(
  SnapshotSelector
);
