import ReactHighcharts from 'react-highcharts';
import highchartsTreemap from 'highcharts-treemap';
import highchartsExporting from 'highcharts/modules/exporting';

let hasBeenInitialized = false;

// wrapper to make sure we only initialize the highcharts component once
function initHighcharts() {
  if (!hasBeenInitialized) {
    highchartsTreemap(ReactHighcharts.Highcharts);
    highchartsExporting(ReactHighcharts.Highcharts);
    hasBeenInitialized = true;
  }
}

export default initHighcharts;
