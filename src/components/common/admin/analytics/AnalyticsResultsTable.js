import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { urlToSource, urlToCollection } from '../../../../lib/urlUtil';

const localMessages = {
  name: { id: 'analytics.table.name', defaultMessage: 'Name' },
  count: { id: 'analytics.table.count', defaultMessage: 'Count' },
};

const AnalyticsResultsTable = props => (
  <div className="analytics-results-table">
    <table className="table">
      <tbody>
        <tr>
          <th><FormattedMessage {...localMessages.name} /></th>
          <th className="numeric"><FormattedMessage {...localMessages.count} /></th>
        </tr>
        {props.results.map((row, idx) => (
          <tr key={`item${idx}`} className={(idx % 2 === 0) ? 'even' : 'odd'}>
            <td>
              <a href={(props.type === 'collection') ? urlToCollection(row.item.tags_id) : urlToSource(row.item.media_id)} target="_new">
                {(props.type === 'collection') ? row.item.label : row.item.name}
              </a>
            </td>
            <td className="numeric">{row.count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

AnalyticsResultsTable.propTypes = {
  // from state
  results: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  // from context
  intl: PropTypes.object.isRequired,
};

export default
injectIntl(
  AnalyticsResultsTable
);
