import PropTypes from 'prop-types';
import React from 'react';
import { Sigma, LoadGEXF } from 'react-sigma';
import { linkToMediaMap } from '../summary/DownloadMapContainer';

const GexfLinkMap = ({ topicId, mediaMapFile }) => (
  <Sigma style={{ border: '1px sold #ccc', width: '1100px', height: '800px' }}>
    <LoadGEXF path={linkToMediaMap(topicId, mediaMapFile)} />
  </Sigma>
);

GexfLinkMap.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  // from state
  // from dispatch
  // from parent
  topicId: PropTypes.number.isRequired,
  mediaMapFile: PropTypes.object.isRequired,
};

export default GexfLinkMap;
