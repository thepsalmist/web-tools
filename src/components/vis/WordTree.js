import PropTypes from 'prop-types';
import React from 'react';
import { Chart } from 'react-google-charts';

const WordTree = (props) => {
  const type = props.type || 'double';
  const sentenceAsData = props.sentences.map(s => [s.toLowerCase()]);
  const chartEvents = [];
  if (props.onChartReady) {
    chartEvents.push({
      eventName: 'ready',
      callback: props.onChartReady,
    });
  }
  return (
    <div className="word-tree">
      <Chart
        chartType="WordTree"
        data={[['Phrases'], ...sentenceAsData]}
        width="100%"
        height={props.height}
        graph_id={props.domId}
        legend_toggle
        options={{
          wordtree: {
            format: 'implicit',
            type,
            word: props.startWord.toLowerCase(),
          },
        }}
        chartEvents={chartEvents}
      />
    </div>
  );
};

WordTree.propTypes = {
  domId: PropTypes.string.isRequired,
  sentences: PropTypes.array.isRequired, // an array sentences
  startWord: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  type: PropTypes.string, // double (default), suffix or prefix
  onChartReady: PropTypes.func,
};

export default WordTree;
