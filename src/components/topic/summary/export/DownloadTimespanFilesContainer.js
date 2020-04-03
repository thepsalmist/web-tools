import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import withFilteredAsyncData from '../../FilteredAsyncDataContainer';
import { fetchTopicTimespanFiles } from '../../../../actions/topicActions';
import DownloadTimespanFiles from './DownloadTimespanFiles';

const DownloadTimespanFilesContainer = ({ filters, files }) => (
  <DownloadTimespanFiles filters={filters} files={files} />
);

DownloadTimespanFilesContainer.propTypes = {
  // from parent
  filters: PropTypes.object.isRequired,
  topicId: PropTypes.number.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  files: PropTypes.array,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.summary.timespanFiles.fetchStatus,
  files: state.topics.selected.summary.timespanFiles.timespan_files,
});

const fetchAsyncData = (dispatch, props) => {
  dispatch(fetchTopicTimespanFiles(props.topicId, props.filters));
};

export default
connect(mapStateToProps)(
  withFilteredAsyncData(fetchAsyncData)(
    DownloadTimespanFilesContainer
  )
);
