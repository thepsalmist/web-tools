/* eslint react/no-this-in-sfc: 0 */

import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import ReactHighcharts from 'react-highcharts';
import initHighcharts from './initHighcharts';

initHighcharts();

const localMessages = {
  tooltipText: { id: 'chart.treeMap.tooltip.text', defaultMessage: '{count} of stories are from {name}.' },
};

/**
 * Pass in data - an array of `name`/`value` objects
 */
const TreeMap = (props) => {
  const { title, data, onLeafClick } = props;
  const { formatNumber, formatMessage } = props.intl;
  const config = {
    colorAxis: {
      minColor: '#FF0000',
      maxColor: '#FFFFFF',
    },
    title: {
      text: title,
    },
    series: [{
      type: 'treemap',
      layoutAlgorithm: 'squarified',
      data,
    }],
    tooltip: {
      pointFormatter: function afmtxn() {
        // important to name this, rather than use arrow function, so `this` is preserved to be what highcharts gives us
        const rounded = formatNumber(this.value, { style: 'percent', maximumFractionDigits: 2 });
        const pct = formatMessage(localMessages.tooltipText, { count: rounded, name: this.name });
        return pct;
      },
    },
    exporting: {
    },
  };
  if (onLeafClick) {
    config.plotOptions = {
      series: {
        cursor: 'pointer',
        point: {
          events: {
            click: function handleLeafClick(event) {
              onLeafClick(event, this); // preserve the highcharts "this", which is the chart
            },
          },
        },
      },
    };
  }
  return (
    <div className="tree-map">
      <ReactHighcharts config={config} />
    </div>
  );
};

TreeMap.propTypes = {
  // from parent
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  onLeafClick: PropTypes.func,
  color: PropTypes.string,
  // from composition chain
  intl: PropTypes.object.isRequired,
};

export default injectIntl(TreeMap);
