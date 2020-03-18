import PropTypes from 'prop-types';
import React from 'react';
import { UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom';
import { ReactSvgPanZoomLoader } from 'react-svg-pan-zoom-loader';
import { urlToMediaMap } from '../summary/DownloadMapContainer';

const SVG_WIDTH = 1296;

const SvgLinkMap = ({ topicId, timespanId, mediaMapFile }) => (
  <ReactSvgPanZoomLoader
    src={urlToMediaMap(topicId, timespanId, mediaMapFile)}
    render={(content) => (
      <UncontrolledReactSVGPanZoom width={1100} height={650}>
        <svg width={SVG_WIDTH} height={SVG_WIDTH}>
          {content}
        </svg>
      </UncontrolledReactSVGPanZoom>
    )}
  />
);

SvgLinkMap.propTypes = {
  // from compositional chain
  // from state
  // from dispatch
  // from parent
  topicId: PropTypes.number.isRequired,
  mediaMapFile: PropTypes.object.isRequired,
  timespanId: PropTypes.number.isRequired,
};

export default SvgLinkMap;
