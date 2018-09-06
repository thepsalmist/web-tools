import PropTypes from 'prop-types';
import React from 'react';
import * as d3 from 'd3';
import d3LayoutCloud from 'd3-cloud';
import { injectIntl } from 'react-intl';

const DEFAULT_WORD_COUNT = 100;
const DEFAULT_WIDTH = 530;
const DEFAULT_HEIGHT = 300;
const DEFAULT_MAX_FONT_SIZE = 36;
const DEFAULT_MIN_FONT_SIZE = 8;
const DEFAULT_TEXT_COLOR = '#333333';
const DEFAULT_LINK_COLOR = '#000000';

const localMessages = {
  wordCloudCount: { id: 'wordcloud.rollover.count', defaultMessage: 'Uses: {count}' },
  wordCloudStem: { id: 'wordcloud.rollover.stem', defaultMessage: 'Stem: {stem}' },
  worldCloudTerm: { id: 'wordcloud.rollover.stem', defaultMessage: 'Term: {term}' },
  wordCloudError: { id: 'wordcloud.error', defaultMessage: 'Sorry, but there aren\'t enough words to render a useful word cloud.' },
};

function drawViz(wrapperElement, {
  words, width, height, maxFontSize, minFontSize, textColor, showTooltips, onWordClick, linkColor, intl,
}) {
  const { formatMessage, formatNumber } = intl;
  const options = {
    width: width || DEFAULT_WIDTH,
    height: height || DEFAULT_HEIGHT,
    maxFontSize: maxFontSize || DEFAULT_MAX_FONT_SIZE,
    minFontSize: minFontSize || DEFAULT_MIN_FONT_SIZE,
    textColor: textColor || DEFAULT_TEXT_COLOR,
    linkColor: linkColor || DEFAULT_LINK_COLOR,
    showTooltips: showTooltips || false,
  };
  // create a rollover tooltip helper
  const body = d3.select('body');
  let tooltipDiv = body.select('.viz-tooltip.word-cloud-tooltip');
  if (tooltipDiv.empty()) {
    tooltipDiv = body.append('div')
      .attr('class', 'viz-tooltip word-cloud-tooltip')
      .style('opacity', 0);
  }
  // start layout
  const node = d3.select(wrapperElement)
    .html('') // important to empty it out first
    .append('svg:svg'); // then add in the SVG wrapper we will be rendering to;
  const counts = words.map(({ count }) => count);
  const max = d3.max(counts);
  const slope = options.maxFontSize / Math.log(max);
  // get list of all words and sizes
  const wordList = words.slice(0, DEFAULT_WORD_COUNT).map(w => ({
    text: w.term,
    stem: w.stem,
    size: slope * Math.log(w.count),
    display: w.display,
  }));
  // create wordcloud
  d3LayoutCloud().size([options.width, options.height])
    .words(wordList)
    .rotate(() => (~~(Math.random() * 1) * 90))
    .font('Arial')
    .fontSize(d => d.size)
    .on('end', (wordsAsData) => {
      // Black and white
      // var fill = d3.scale.linear().domain([0,100]).range(['black','white']);
      // Colors
      node
        .attr('width', options.width).attr('height', options.height)
        .append('g')
        .attr('transform', `translate(${options.width / 2},${options.height / 2})`)
        .selectAll('text')
        .data(wordsAsData)
        .enter()
        .append('text')
        .attr('font-family', 'Lato, Helvetica, sans')
        .attr('font-size', d => `${d.size}px`)
        .attr('fill', options.textColor)
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bold')
        .attr('transform', d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
        .text(d => d.text);
    })
    .start();
  if (onWordClick !== undefined) {
    node.selectAll('text')
      .on('mouseover', (d, index, list) => {
        d3.select(list[index]).attr('fill', options.linkColor)
          .attr('cursor', 'pointer');
        if (options.showTooltips) {
          let tooltipHtml = formatMessage(localMessages.wordCloudStem, { stem: d.stem });
          tooltipHtml += '<br />';
          tooltipHtml += formatMessage(localMessages.worldCloudTerm, { term: d.term });
          tooltipHtml += '<br />';
          tooltipHtml += formatMessage(localMessages.wordCloudCount, { count: formatNumber(d.count) });
          tooltipDiv.transition()
            .duration(200)
            .style('opacity', 0.9);
          tooltipDiv.html(tooltipHtml)
            .style('left', `${d3.event.pageX}px`)
            .style('top', `${d3.event.pageY - 48}px`);
        }
      })
      .on('mouseout', (d, index, list) => {
        d3.select(list[index]).attr('fill', options.textColor)
          .attr('cursor', 'default');
        if (options.showTooltips) {
          tooltipDiv.transition()
            .duration(500)
            .style('opacity', 0);
        }
      })
      .on('click', (d) => {
        onWordClick(d);
      });
  }
}

class WordCloud extends React.Component {
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
    const { domId } = this.props;
    return (
      <div className="editable-word-cloud" ref={this.chartWrapperRef} id={domId} />
    );
  }
}

WordCloud.propTypes = {
  words: PropTypes.array.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  maxFontSize: PropTypes.number,
  minFontSize: PropTypes.number,
  textColor: PropTypes.string,
  onWordClick: PropTypes.func,
  linkColor: PropTypes.string,
  showTooltips: PropTypes.bool,
  domId: PropTypes.string,
  // from compositon chain
  intl: PropTypes.object.isRequired,
//  alreadyNormalized: PropTypes.bool,
//  fullExtent: PropTypes.array,
};

export default injectIntl(WordCloud);
