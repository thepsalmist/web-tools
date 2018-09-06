import PropTypes from 'prop-types';
import React from 'react';
import * as d3 from 'd3';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';
import fontSizeComputer from '../../lib/visUtil';
import { WarningNotice } from '../common/Notice';

const localMessages = {
  noData: { id: 'wordspace.noData', defaultMessage: 'Not enough data to show.' },
};

const DEFAULT_LENGTH = 750; // svg must have square dimensions
const DEFAULT_MARGIN = 80;
const DEFAULT_MIN_FONT_SIZE = 10;
const DEFAULT_MAX_FONT_SIZE = 30;
const DEFAULT_MIN_COLOR = '#CCCCCC';
const DEFAULT_MAX_COLOR = '#000000';
const DEFAULT_HIGHLIGHT_MIN_COLOR = '#9ecae1';
const DEFAULT_HIGHLIGHT_MAX_COLOR = '#08306b';
const DEFAULT_HIGHLIGHT_FONT_SIZE_SCALE = 1.5;
const DEFAULT_COS_SIM_THRESHOLD = 0.95;
const DEFAULT_MOUSEOVER_TRANSITION_TIME = 400;

const ARC_FILL = '#000000';
const ARC_FILL_OPACITY = '0.1';
const ARC_LINE = '#000000';
const ARC_LINE_OPACITY = '0.05';
const RADIUS_RATIOS = [1, 0.75, 0.5, 0.25];
const MAX_ZOOM_SCALE = 3.5;

function drawViz(wrapperElement, props) {
  const { words, scaleWords, length, margin, minFontSize, maxFontSize, minColor, maxColor,
    highlightMinColor, highlightMaxColor, highlightFontSizeScale, showTooltips, alreadyNormalized,
    fullExtent, domId, xProperty, yProperty, cosSimThreshold } = props;
  // console.log(words[0].count);
  // console.log(domId);
  const options = {
    scaleWords,
    length,
    margin,
    minFontSize,
    maxFontSize,
    minColor,
    maxColor,
    highlightMinColor,
    highlightMaxColor,
    highlightFontSizeScale,
    showTooltips,
    alreadyNormalized,
    fullExtent,
    cosSimThreshold,
  };

  if (length === undefined) {
    options.length = DEFAULT_LENGTH;
  }
  if (margin === undefined) {
    options.margin = DEFAULT_MARGIN;
  }
  if (minFontSize === undefined) {
    options.minFontSize = DEFAULT_MIN_FONT_SIZE;
  }
  if (maxFontSize === undefined) {
    options.maxFontSize = DEFAULT_MAX_FONT_SIZE;
  }
  if (minColor === undefined) {
    options.minColor = DEFAULT_MIN_COLOR;
  }
  if (maxColor === undefined) {
    options.maxColor = DEFAULT_MAX_COLOR;
  }
  if (highlightMinColor === undefined) {
    options.highlightMinColor = DEFAULT_HIGHLIGHT_MIN_COLOR;
  }
  if (highlightMaxColor === undefined) {
    options.highlightMaxColor = DEFAULT_HIGHLIGHT_MAX_COLOR;
  }
  if (highlightFontSizeScale === undefined) {
    options.highlightFontSizeScale = DEFAULT_HIGHLIGHT_FONT_SIZE_SCALE;
  }
  if (showTooltips === undefined) {
    options.showTooltips = false;
  }
  if (alreadyNormalized === undefined) {
    options.alreadyNormalized = false;
  }
  if (cosSimThreshold === undefined) {
    options.cosSimThreshold = DEFAULT_COS_SIM_THRESHOLD;
  }

  // add in tf normalization
  const allSum = d3.sum(words, term => parseInt(term.count, 10));
  if (!options.alreadyNormalized) {
    words.forEach((term, idx) => { words[idx].tfnorm = term.count / allSum; });
  }

  if (fullExtent === undefined) {
    options.fullExtent = d3.extent(words, d => d.tfnorm);
  }

  options.xProperty = xProperty || 'x';
  options.yProperty = yProperty || 'y';

  // alternative list of words used to set scales and margins
  options.scaleWords = scaleWords || words;

  // add in similarity score
  words.forEach((a, i) => {
    words[i].similar = [];
    words.forEach((b) => {
      if (a.term !== b.term) {
        const dotProd = (a[options.xProperty] * b[options.xProperty]) + (a[options.yProperty] * b[options.yProperty]);
        const aLen = ((a[options.xProperty] ** 2) + (a[options.yProperty] ** 2)) ** 0.5;
        const bLen = ((b[options.xProperty] ** 2) + (b[options.yProperty] ** 2)) ** 0.5;
        const cosSim = dotProd / (aLen * bLen);
        if (cosSim > options.cosSimThreshold) {
          words[i].similar.push({ term: b.term, tfnorm: b.tfnorm, score: cosSim });
        }
      }
    });
  });

  const maxRadius = d3.max(options.scaleWords.map(d => ((d[options.xProperty] ** 2) + (d[options.yProperty] ** 2)) ** 0.5));

  // Define Scales
  const xScale = d3.scaleLinear()
    .domain([-maxRadius, maxRadius])
    .range([options.margin, options.length - options.margin]);

  const yScale = d3.scaleLinear()
    .domain([-maxRadius, maxRadius])
    .range([options.length - options.margin, options.margin]);

  const colorScale = d3.scaleLinear()
    .domain(options.fullExtent)
    .range([options.minColor, options.maxColor]);

  const highlightColorScale = d3.scaleLinear()
    .domain(options.fullExtent)
    .range([options.highlightMinColor, options.highlightMaxColor]);

  const scaledRadius = xScale(0) - yScale(maxRadius);

  const sizeRange = { min: options.minFontSize, max: options.maxFontSize };

  // start layout
  const svgNode = d3.select(wrapperElement)
    .html('') // important to empty it out first
    .append('svg:svg'); // then add in the SVG wrapper we will be rendering to

  svgNode.attr('id', domId)
    .attr('width', options.length)
    .attr('height', options.length);

  // set up zoom
  let zoomedIn = false;
  const zoom = d3.zoom()
    .scaleExtent([1, MAX_ZOOM_SCALE])
    .translateExtent([[options.margin, options.margin], [options.length - options.margin, options.length - options.margin]])
    .extent([[options.margin, options.margin], [options.length - options.margin, options.length - options.margin]])
    .on('zoom', () => {
      const { transform } = d3.event;

      // update circles and arc tool-tip
      d3.select('#concentric-circles').attr('transform', transform);
      d3.select('#arc-tip').attr('transform', transform);

      // update origin point
      d3.select('#origin')
        .attr('cx', () => transform.applyX(xScale(0)))
        .attr('cy', () => transform.applyY(yScale(0)));

      // re-draw text with new scale
      svgNode
        .selectAll('text')
        .attr('x', d => transform.applyX(xScale(d[options.xProperty])))
        .attr('y', d => transform.applyY(yScale(d[options.yProperty])));

      // update axis lines
      const axisIds = ['pos-y-axis', 'pos-x-axis', 'neg-y-axis', 'neg-x-axis'];
      axisIds.forEach((id) => {
        let x2 = 0;
        let y2 = 0;
        if (id === 'pos-y-axis' || id === 'neg-y-axis') {
          y2 = maxRadius;
        } else {
          x2 = maxRadius;
        }
        d3.select(`#${id}`)
          .attr('x1', transform.applyX(xScale(0)))
          .attr('y1', transform.applyY(yScale(0)))
          .attr('x2', id === 'neg-x-axis' ? transform.applyX(xScale(-x2)) : transform.applyX(xScale(x2)))
          .attr('y2', id === 'neg-y-axis' ? transform.applyY(yScale(-y2)) : transform.applyY(yScale(y2)));
      });

      // update 45-degree lines
      const quadIds = ['quad-1-axis', 'quad-2-axis', 'quad-3-axis', 'quad-4-axis'];
      quadIds.forEach((id) => {
        const x2 = maxRadius * Math.cos(Math.PI / 4);
        const y2 = maxRadius * Math.sin(Math.PI / 4);
        d3.select(`#${id}`)
          .attr('x1', transform.applyX(xScale(0)))
          .attr('y1', transform.applyY(yScale(0)))
          .attr('x2', id === 'quad-3-axis' || id === 'quad-4-axis' ? transform.applyX(xScale(-x2)) : transform.applyX(xScale(x2)))
          .attr('y2', id === 'quad-2-axis' || id === 'quad-3-axis' ? transform.applyY(yScale(-y2)) : transform.applyY(yScale(y2)));
      });
    });

  // set custom behavior for zoom on double-click
  svgNode
    .call(zoom)
    .on('dblclick.zoom', () => {
      if (zoomedIn) {
        svgNode.style('cursor', 'default'); // for IE since zoom-in isn't supported
        svgNode.style('cursor', 'zoom-in');
        svgNode.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
        zoomedIn = false;
      } else {
        svgNode.style('cursor', 'move');
        svgNode.transition().duration(750).call(zoom.scaleBy, 2);
        zoomedIn = true;
      }
    })
    .append('g');

  // remove default zoom scroll behavior
  svgNode.on('wheel.zoom', null);
  svgNode.on('mousewheel.zoom', null);
  svgNode.on('MozMousePixelScroll.zoom', null);

  // draw arc 'tooltip'
  const arcContainer = svgNode.append('g').attr('id', 'arc-tip');
  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(scaledRadius)
    .startAngle(0)
    .endAngle(Math.acos(options.cosSimThreshold) * 2);
  arcContainer.append('path')
    .attr('d', arc)
    .attr('id', 'arc')
    .attr('fill', ARC_FILL)
    .attr('fill-opacity', ARC_FILL_OPACITY)
    .attr('transform', `translate(${xScale(0)}, ${yScale(0)})`)
    .style('opacity', 0);

  // draw concentric circles
  const circleContainer = svgNode.append('g').attr('id', 'concentric-circles');
  for (let i = 0; i < 4; i += 1) {
    circleContainer.append('circle')
      .attr('id', `circle-${i}`)
      .attr('cx', xScale(0))
      .attr('cy', yScale(0))
      .attr('r', scaledRadius * RADIUS_RATIOS[i])
      .attr('stroke', ARC_LINE)
      .attr('stroke-opacity', ARC_LINE_OPACITY)
      .style('fill', 'none');
  }

  // axis polar coord lines
  const axisIds = ['pos-y-axis', 'pos-x-axis', 'neg-y-axis', 'neg-x-axis'];
  axisIds.forEach((id) => {
    let x2 = 0;
    let y2 = 0;
    if (id === 'pos-y-axis' || id === 'neg-y-axis') {
      y2 = maxRadius;
    } else {
      x2 = maxRadius;
    }
    svgNode
      .append('svg:line')
      .attr('id', id)
      .attr('x1', xScale(0))
      .attr('y1', yScale(0))
      .attr('x2', id === 'neg-x-axis' ? xScale(-x2) : xScale(x2))
      .attr('y2', id === 'neg-y-axis' ? yScale(-y2) : yScale(y2))
      .style('stroke', ARC_LINE)
      .attr('stroke-opacity', ARC_LINE_OPACITY);
  });

  // 45-degree lines
  const quadIds = ['quad-1-axis', 'quad-2-axis', 'quad-3-axis', 'quad-4-axis'];
  quadIds.forEach((id) => {
    const x1 = 0;
    const y1 = 0;
    const x2 = maxRadius * Math.cos(Math.PI / 4);
    const y2 = maxRadius * Math.sin(Math.PI / 4);
    svgNode
      .append('svg:line')
      .attr('id', id)
      .attr('x1', xScale(x1))
      .attr('y1', yScale(y1))
      .attr('x2', id === 'quad-3-axis' || id === 'quad-4-axis' ? xScale(-x2) : xScale(x2))
      .attr('y2', id === 'quad-2-axis' || id === 'quad-3-axis' ? yScale(-y2) : yScale(y2))
      .style('stroke', ARC_LINE)
      .attr('stroke-opacity', ARC_LINE_OPACITY);
  });

  // Add circle at origin
  svgNode
    .append('circle')
    .attr('id', 'origin')
    .attr('cx', xScale(0))
    .attr('cy', yScale(0))
    .attr('r', 5)
    .style('fill', 'black');

  // Add Text Labels
  const sortedWords = words.sort((a, b) => a.tfnorm - b.tfnorm); // important to sort so z order is right

  svgNode
    .selectAll('text')
    .data(sortedWords)
    .enter()
    .append('text')
    .attr('text-anchor', 'middle')
    .text(d => d.term)
    .attr('x', d => xScale(d[options.xProperty]))
    .attr('y', d => yScale(d[options.yProperty]))
    .attr('fill', d => colorScale(d.tfnorm))
    .attr('font-size', (d) => {
      const fs = fontSizeComputer(d, options.fullExtent, sizeRange);
      return `${fs}px`;
    })
    .on('mouseover', (d) => {
      // calculate angle from (x, y) coordinates
      let currentAngle = Math.atan(Math.abs(d[options.yProperty] / d[options.xProperty])) * (180 / Math.PI);
      const offset = Math.acos(options.cosSimThreshold) * (180 / Math.PI);

      if (d[options.xProperty] > 0 && d[options.yProperty] > 0) { // 1st quadrant
        currentAngle = (90.0 - currentAngle) - offset;
      } else if (d[options.xProperty] > 0 && d[options.yProperty] < 0) { // 2nd quadrant
        currentAngle = (90.0 + currentAngle) - offset;
      } else if (d[options.xProperty] < 0 && d[options.yProperty] < 0) { // 3rd quadrant
        currentAngle = ((-90.0) - currentAngle) - offset;
      } else if (d[options.xProperty] < 0 && d[options.yProperty] > 0) { // 4th quadrant
        currentAngle = ((-90.0) + currentAngle) - offset;
      }

      // rotate and show arc tooltip
      d3.select('#arc')
        .attr('transform', `translate(${xScale(0)}, ${yScale(0)}) rotate(${currentAngle})`);
      d3.select('#arc')
        .style('opacity', 1);

      // highlight selected word and move to front
      const { event } = d3;
      d3.select(event.target)
        .transition()
        .duration(DEFAULT_MOUSEOVER_TRANSITION_TIME)
        .attr('fill', highlightColorScale(d.tfnorm))
        .attr('font-size', () => {
          const fs = fontSizeComputer(d, options.fullExtent, sizeRange);
          return `${1.2 * fs}px`;
        })
        .attr('font-weight', 'bold');
      d3.select(event.target).raise();

      // highlight similar words
      svgNode
        .selectAll('text')
        .filter(other => d.similar.map(x => x.term).indexOf(other.term) !== -1 && other.term !== d.term)
        .transition()
        .duration(DEFAULT_MOUSEOVER_TRANSITION_TIME)
        .attr('fill', other => highlightColorScale(other.tfnorm))
        .attr('font-size', (other) => {
          const fs = fontSizeComputer(other, options.fullExtent, sizeRange);
          return `${options.highlightFontSizeScale * fs}px`;
        })
        .attr('font-weight', 'bold')
        .attr('pointer-events', 'none');

      // bring similar words to front
      svgNode
        .selectAll('text')
        .filter(other => d.similar.map(x => x.term).indexOf(other.term) !== -1 && other.term !== d.term)
        .raise();

      // gray-out non-similar words
      svgNode
        .selectAll('text')
        .filter(other => d.similar.map(x => x.term).indexOf(other.term) === -1 && other.term !== d.term)
        .transition()
        .duration(DEFAULT_MOUSEOVER_TRANSITION_TIME)
        .attr('fill', '#e2e2e2')
        .attr('pointer-events', 'none');
    })
    .on('mouseout', () => {
      // reset and hide arc tooltip
      d3.select('#arc')
        .style('opacity', 0)
        .attr('transform', `translate(${xScale(0)}, ${yScale(0)}) rotate(0)`);

      // return selected word to normal
      svgNode
        .selectAll('text')
        .transition()
        .duration(100)
        .attr('fill', other => colorScale(other.tfnorm))
        .attr('font-size', (other) => {
          const fs = fontSizeComputer(other, options.fullExtent, sizeRange);
          return `${fs}px`;
        })
        .attr('font-weight', 'normal')
        .attr('pointer-events', 'auto');
    });
}

class WordSpace extends React.Component {
  constructor(props) {
    super(props);
    this.chartWrapperRef = React.createRef();
  }

  componentDidMount() {
    drawViz(this.chartWrapperRef.current, this.props);
  }

  componentDidUpdate() {
    drawViz(this.chartWrapperRef.current, this.props);
  }

  render() {
    // bail if the properties aren't there
    const { words, noDataMsg, xProperty, yProperty } = this.props;
    const wordsWithXYCount = words.filter(w => (w[xProperty] !== undefined) && (w[yProperty] !== undefined)).length;
    const missingDataMsg = noDataMsg || localMessages.noData;
    if (wordsWithXYCount === 0) {
      return (
        <WarningNotice>
          <FormattedHTMLMessage {...missingDataMsg} />
        </WarningNotice>
      );
    }

    return (
      <div className="wordspace-chart-wrapper" ref={this.chartWrapperRef} />
    );
  }
}

WordSpace.propTypes = {
  // from parent
  words: PropTypes.array.isRequired,
  scaleWords: PropTypes.array,
  length: PropTypes.number,
  margin: PropTypes.number,
  minFontSize: PropTypes.number,
  maxFontSize: PropTypes.number,
  minColor: PropTypes.string,
  maxColor: PropTypes.string,
  highlightMinColor: PropTypes.string,
  highlightMaxColor: PropTypes.string,
  highlightFontSizeScale: PropTypes.number,
  fullExtent: PropTypes.array,
  showTooltips: PropTypes.bool,
  alreadyNormalized: PropTypes.bool,
  domId: PropTypes.string.isRequired,
  xProperty: PropTypes.string,
  yProperty: PropTypes.string,
  noDataMsg: PropTypes.object,
  cosSimThreshold: PropTypes.number,
  // from composition chain
  intl: PropTypes.object.isRequired,
};

export default injectIntl(WordSpace);
