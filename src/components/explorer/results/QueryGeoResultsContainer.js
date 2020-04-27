import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl, FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import withSummary from '../../common/hocs/SummarizedVizualization';
import withQueryResults from './QueryResultsSelector';
import GeoChart from '../../vis/GeoChart';
import { fetchDemoQueryGeo, fetchQueryGeo, resetGeo } from '../../../actions/explorerActions';
import { DownloadButton } from '../../common/IconButton';
import ActionMenu from '../../common/ActionMenu';
import messages from '../../../resources/messages';
import { postToDownloadUrl, COVERAGE_REQUIRED } from '../../../lib/explorerUtil';

const localMessages = {
  title: { id: 'explorer.geo.title', defaultMessage: 'Geographic Coverage' },
  help: { id: 'explorer.geo.help',
    defaultMessage: '<p>Sometimes media coverage can differ based on the place being talked about. Digging into the <i>geography</i> of the coverage can provide clues to help you understand the narratives. This heatmap shows you the countries that were most often the focus of stories. Click a country to load an Explorer search showing you how the sources in this collection cover it.</p>' },
  descriptionIntro: { id: 'explorer.geo.help.title', defaultMessage: 'About Geographic Attention' },
  downloadCsv: { id: 'explorer.geo.downloadCsv', defaultMessage: 'Download { name } Top Countries CSV' },
  downloadTopPlacesCsv: { id: 'explorer.geo.downloadTopCsv', defaultMessage: 'Download { name } Top Places (city, state, or country) CSV' },
};

class QueryGeoResultsContainer extends React.Component {
  downloadCsv = (query) => {
    postToDownloadUrl('/api/explorer/geography/geography.csv', query);
  }

  downloadTopPlacesCsv = (query) => {
    postToDownloadUrl('/api/explorer/geography/topplaces.csv', query);
  }

  render() {
    const { results, intl, selectedQuery, handleCountryClick, tabSelector } = this.props;
    const { formatNumber } = intl;
    let content;
    const selectedResults = results[selectedQuery.uid];
    const coverageRatio = selectedResults.coverage_percentage;
    if (coverageRatio > COVERAGE_REQUIRED) {
      const data = selectedResults.results.map(item => ({ ...item, value: item.pct }));
      content = (
        <div>
          {selectedResults && (
            <GeoChart
              data={data}
              countryMaxColorScale={selectedQuery.color}
              hideLegend
              onCountryClick={handleCountryClick}
              backgroundColor="#f5f5f5"
            />
          )}
        </div>
      );
    } else {
      content = (
        <p>
          <FormattedHTMLMessage
            {...messages.notEnoughCoverage}
            values={{ pct: formatNumber(coverageRatio, { style: 'percent', maximumFractionDigits: 2 }) }}
          />
        </p>
      );
    }
    return (
      <div>
        { tabSelector }
        { content }
        <div className="actions">
          <ActionMenu actionTextMsg={messages.downloadOptions}>
            <MenuItem
              className="action-icon-menu-item"
              onClick={() => this.downloadCsv(selectedQuery)}
            >
              <ListItemText>
                <FormattedMessage {...localMessages.downloadCsv} values={{ name: selectedQuery.label }} />
              </ListItemText>
              <ListItemIcon>
                <DownloadButton />
              </ListItemIcon>
            </MenuItem>
            <MenuItem
              className="action-icon-menu-item"
              onClick={() => this.downloadTopPlacesCsv(selectedQuery)}
            >
              <ListItemText>
                <FormattedMessage {...localMessages.downloadTopPlacesCsv} values={{ name: selectedQuery.label }} />
              </ListItemText>
              <ListItemIcon>
                <DownloadButton />
              </ListItemIcon>
            </MenuItem>
          </ActionMenu>
        </div>
      </div>
    );
  }
}

QueryGeoResultsContainer.propTypes = {
  // from parent
  lastSearchTime: PropTypes.number.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  onQueryModificationRequested: PropTypes.func.isRequired,
  selectedQuery: PropTypes.object.isRequired,
  // from composition
  intl: PropTypes.object.isRequired,
  // from dispatch
  results: PropTypes.object.isRequired,
  handleCountryClick: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  tabSelector: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  lastSearchTime: state.explorer.lastSearchTime.time,
  fetchStatus: state.explorer.geo.fetchStatus,
  results: state.explorer.geo.results,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleCountryClick: (evt, data) => {
    const countryQueryClause = `tags_id_stories:${data.tags_id}`;
    ownProps.onQueryModificationRequested(countryQueryClause);
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withSummary(localMessages.title, localMessages.help, [messages.heatMapHelpText])(
      withQueryResults(resetGeo, fetchQueryGeo, fetchDemoQueryGeo)(
        QueryGeoResultsContainer
      )
    )
  )
);
