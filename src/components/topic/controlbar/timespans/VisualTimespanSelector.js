/* eslint indent: 0 */

import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import * as d3 from 'd3';
import dimensions from 'react-dimensions';
import { getBrandDarkColor } from '../../../../styles/colors';

function drawViz(wrapperElement, {
  containerWidth, timespans, selectedTimespan, onTimespanSelected, startDate, endDate, intl,
}) {
  const formattedDate = d => intl.formatDate(d, { year: '2-digit', month: 'numeric', day: 'numeric' });
  const horizontalPadding = 30;
  const verticalPadding = 0;
  const width = containerWidth - horizontalPadding;
  const height = 48;
  const node = d3.select(wrapperElement)
    .html('') // important to empty it out first
    .append('svg:svg'); // then add in the SVG wrapper we will be rendering to
  const dateRange = [startDate, endDate];
  const xScale = d3.scaleUtc().domain(dateRange).range([0, width - (horizontalPadding * 2)]);
  const svg = node
    .attr('class', 'visual-timespan-selector')
    .attr('height', height)
    .attr('width', width);
  const xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks(10)
    .tickFormat(d => formattedDate(d));
  const chartWrapper = svg.append('g')
    .attr('class', 'chart')
    .attr('transform', `translate(${horizontalPadding},${verticalPadding})`);
  // add the axis
  chartWrapper.append('g')
    .attr('class', 'xaxis')
    .attr('transform', 'translate(0,20)')
    .call(xAxis);
  chartWrapper.selectAll('.xaxis text')
    .attr('transform', 'translate(0,7)');
  // add the timespans
  chartWrapper.append('g')
    .attr('class', 'data')
    .selectAll('.timespan')
      .data(timespans)
      .enter()
        .append('rect')
          .attr('class', 'timespan')
          .attr('x', t => xScale(t.startDateMoment.toDate()))
          .attr('y', 0)
          .attr('data-id', t => t.timespan_id)
          .attr('data-start', t => xScale(t.startDateMoment.toDate()))
          .attr('data-end', t => xScale(t.endDateMoment.toDate()))
          .attr('width', t => (xScale(t.endDateMoment.toDate()) - xScale(t.startDateMoment.toDate())))
          .attr('height', 20)
          .on('click', onTimespanSelected)
          .append('svg:title')
            .text(t => `${formattedDate(t.startDateMoment.toDate())}-${formattedDate(t.endDateMoment.toDate())}`);
  // highlight the selected timespan
  if (timespans.includes(selectedTimespan)) {
    chartWrapper
      .append('g')
      .attr('class', 'selected-data')
        .append('rect')
          .attr('class', 'timespan')
          .attr('x', xScale(selectedTimespan.startDateMoment.toDate()))
          .attr('y', 0)
          .attr('data-id', selectedTimespan.timespan_id)
          .attr('data-start', xScale(selectedTimespan.startDateMoment.toDate()))
          .attr('data-end', xScale(selectedTimespan.endDateMoment.toDate()))
          .attr('width', xScale(selectedTimespan.endDateMoment.toDate()) - xScale(selectedTimespan.startDateMoment.toDate()))
          .attr('height', 20)
          .attr('style', `fill:${getBrandDarkColor()};fill-opacity:0.9`)
          .on('click', onTimespanSelected)
          .append('svg:title')
            .text(`${formattedDate(selectedTimespan.startDateMoment.toDate())}-${formattedDate(selectedTimespan.endDateMoment.toDate())}`);
  }
}

class VisualTimespanSelector extends React.Component {
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
    return (
      <div className="visual-timespan-selector-wrapper" ref={this.chartWrapperRef} />
    );
  }
}

VisualTimespanSelector.propTypes = {
  // from parent
  startDate: PropTypes.object.isRequired,
  endDate: PropTypes.object.isRequired,
  timespans: PropTypes.array.isRequired,
  onTimespanSelected: PropTypes.func,
  selectedTimespan: PropTypes.object,
  // from context
  intl: PropTypes.object.isRequired,
  // from Dimensions helper
  containerWidth: PropTypes.number,
};

export default
  injectIntl(
    dimensions()(VisualTimespanSelector)
  );
