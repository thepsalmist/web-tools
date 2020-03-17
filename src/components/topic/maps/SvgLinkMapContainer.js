import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom';
import withFilteredAsyncData from '../FilteredAsyncDataContainer';
import { fetchTopicMediaMapFile } from '../../../actions/topicActions';

const SvgLinkMapContainer = ({ svgData }) => <UncontrolledReactSVGPanZoom width={1100} height={600}> {svgData} </UncontrolledReactSVGPanZoom>;

SvgLinkMapContainer.propTypes = {
  // from parent
  topicId: PropTypes.number.isRequired,
  mediaMapFile: PropTypes.object.isRequired,
  // from state
  svgData: PropTypes.string,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.mapFiles.fetchStatus,
  svgData: state.topics.selected.mapFiles.svg,
});

const fetchAsyncData = (dispatch, { topicId, mediaMapFile }) => {
  dispatch(fetchTopicMediaMapFile(topicId, mediaMapFile.timespan_maps_id));
};

export default
connect(mapStateToProps)(
  withFilteredAsyncData(fetchAsyncData)(
    SvgLinkMapContainer
  )
);
