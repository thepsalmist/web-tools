import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import withFilteredAsyncData from '../../FilteredAsyncDataContainer';
import { fetchTopicSnapshotFiles } from '../../../../actions/topicActions';
import DownloadSnapshotFiles from './DownloadSnapshotFiles';

const DownloadSnapshotFilesContainer = ({ files }) => (
  <DownloadSnapshotFiles files={files} />
);

DownloadSnapshotFilesContainer.propTypes = {
  // from parent
  filters: PropTypes.object.isRequired,
  topicId: PropTypes.number.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  files: PropTypes.array,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.summary.snapshotFiles.fetchStatus,
  files: state.topics.selected.summary.snapshotFiles.snapshot_files,
});

const fetchAsyncData = (dispatch, props) => {
  dispatch(fetchTopicSnapshotFiles(props.topicId, props.filters));
};

export default
connect(mapStateToProps)(
  withFilteredAsyncData(fetchAsyncData)(
    DownloadSnapshotFilesContainer
  )
);
