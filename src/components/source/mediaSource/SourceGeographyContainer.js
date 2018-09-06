import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import GeoChart from '../../vis/GeoChart';
import DataCard from '../../common/DataCard';
import { fetchSourceGeo } from '../../../actions/sourceActions';
import messages from '../../../resources/messages';
import withHelp from '../../common/hocs/HelpfulContainer';
import { DownloadButton } from '../../common/IconButton';
import { getBrandLightColor } from '../../../styles/colors';
import { getCurrentDate, oneMonthBefore } from '../../../lib/dateUtil';
import { urlToExplorerQuery } from '../../../lib/urlUtil';

const localMessages = {
  title: { id: 'source.summary.map.title', defaultMessage: 'Geographic Attention' },
  helpTitle: { id: 'source.summary.map.help.title', defaultMessage: 'Geographic Attention' },
  intro: { id: 'source.summary.map.intro',
    defaultMessage: '<p>Here is a heatmap of countries stories from this source are about (based on a sample of stories). Darker countried are mentioned more. Click a country to load an Explorer search showing you how the this source covers it.</p>' },
};

class SourceGeographyContainer extends React.Component {
  downloadCsv = () => {
    const { source } = this.props;
    const url = `/api/sources/${source.media_id}/geography/geography.csv`;
    window.location = url;
  }

  handleCountryClick= (event, geo) => {
    const { source } = this.props;
    const countryName = geo.name;
    const countryTagId = geo.tags_id;
    const endDate = getCurrentDate();
    const startDate = oneMonthBefore(endDate);
    const url = urlToExplorerQuery(`${countryName} in ${source.name || source.url}`, `(tags_id_stories:${countryTagId})`,
      [source.media_id], [], startDate, endDate);
    window.open(url, '_blank');
  }

  render() {
    const { intro, geolist, helpButton } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <DataCard>
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <h2>
          <FormattedMessage {...localMessages.title} />
          {helpButton}
        </h2>
        <p>{intro}</p>
        <GeoChart data={geolist} onCountryClick={this.handleCountryClick} countryMaxColorScale={getBrandLightColor()} />
      </DataCard>
    );
  }
}

SourceGeographyContainer.propTypes = {
  // from parent
  source: PropTypes.object.isRequired,
  // from state
  fetchStatus: PropTypes.string,
  geolist: PropTypes.array.isRequired,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
  // from parent
  intro: PropTypes.string,
  // from composition
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.sources.selected.geoTag.fetchStatus,
  total: state.sources.sources.selected.geoTag.total,
  geolist: state.sources.sources.selected.geoTag.list,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(fetchSourceGeo(ownProps.source.media_id));
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withHelp(localMessages.helpTitle, [localMessages.intro, messages.heatMapHelpText])(
      withAsyncFetch(
        SourceGeographyContainer
      )
    )
  )
);
