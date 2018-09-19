import PropTypes from 'prop-types';
import React from 'react';
import { Chart } from 'react-google-charts';
import { getBrandDarkColor } from '../../styles/colors';

const CalendarChart = (props) => {
  const numYears = 3;
  const height = (((props.cellSize * 7) + 20) * numYears) + 40; // based on how the width renders each year
  return (
    <div className="calendar-chart">
      <Chart
        chartType="Calendar"
        data={[['date', 'count'], ...props.data]}
        graph_id={props.domId}
        width="100%"
        height={`${height}px`}
        legend_toggle
        options={{
          calendar: {
            cellSize: props.cellSize,
            colorAxis: {
              minValue: 0,
              colors: ['#FFFFFF', getBrandDarkColor()],
            },
          },
        }}
      />
    </div>
  );
};

CalendarChart.propTypes = {
  domId: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired, // an array of [jsDateObj, countInteger]
  cellSize: PropTypes.number.isRequired,
};

export default CalendarChart;
