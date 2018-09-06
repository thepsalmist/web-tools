import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import GeoChart from '../../vis/GeoChart';
import DataCard from '../../common/DataCard';
import { fetchCollectionGeo } from '../../../actions/sourceActions';
import messages from '../../../resources/messages';
import withHelp from '../../common/hocs/HelpfulContainer';
import { DownloadButton } from '../../common/IconButton';
import { getBrandLightColor } from '../../../styles/colors';
import { getCurrentDate, oneMonthBefore } from '../../../lib/dateUtil';
import { urlToExplorerQuery } from '../../../lib/urlUtil';

const localMessages = {
  title: { id: 'collection.summary.geo.title', defaultMessage: 'Geographic Attention over the last month' },
  intro: { id: 'collection.summary.geo.info',
    defaultMessage: '<p>Here is a heatmap of countries mentioned in this collection. Darker countried are mentioned more. Click a country to load an Explorer search showing you how the sources in this collection cover it.</p>' },
  helpTitle: { id: 'collection.summary.geo.help.title', defaultMessage: 'About Geographic Attention' },
};

class CollectionGeographyContainer extends React.Component {
  downloadCsv = () => {
    const { collectionId } = this.props;
    const url = `/api/collections/${collectionId}/geography/geography.csv`;
    window.location = url;
  }

  handleCountryClick = (event, geo) => {
    const { collectionId, collectionName } = this.props;
    const countryName = geo.name;
    const countryTagId = geo.tags_id;
    const endDate = getCurrentDate();
    const startDate = oneMonthBefore(endDate);
    const url = urlToExplorerQuery(`${countryName} in ${collectionName}`, `(tags_id_stories:${countryTagId})`,
      [], [collectionId], startDate, endDate);
    window.open(url, '_blank');
  }

  render() {
    const { geolist, intl, helpButton } = this.props;
    const { formatMessage } = intl;
    return (
      <DataCard>
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <h2>
          <FormattedMessage {...localMessages.title} />
          {helpButton}
        </h2>
        <GeoChart data={geolist} onCountryClick={this.handleCountryClick} countryMaxColorScale={getBrandLightColor()} />
      </DataCard>
    );
  }
}

CollectionGeographyContainer.propTypes = {
  // from state
  geolist: PropTypes.array.isRequired,
  fetchStatus: PropTypes.string,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
  // from parent
  collectionName: PropTypes.string.isRequired,
  collectionId: PropTypes.number.isRequired,
  // from composition
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.collections.selected.collectionGeoTag.fetchStatus,
  geolist: state.sources.collections.selected.collectionGeoTag.list,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(fetchCollectionGeo(ownProps.collectionId));
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withHelp(localMessages.helpTitle, [localMessages.intro, messages.heatMapHelpText])(
      withAsyncFetch(
        CollectionGeographyContainer
      )
    )
  )
);
