import PropTypes from 'prop-types';
import React from 'react';
import { FormattedHTMLMessage, FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ActionMenu from '../../common/ActionMenu';
import withFilteredAsyncData from '../FilteredAsyncDataContainer';
import GeoChart from '../../vis/GeoChart';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_LOGGED_IN } from '../../../lib/auth';
import { filtersAsUrlParams } from '../../util/location';
import messages from '../../../resources/messages';
import withSummary from '../../common/hocs/SummarizedVizualization';
import { DownloadButton } from '../../common/IconButton';
import { getBrandLightColor } from '../../../styles/colors';
import { fetchTopicGeocodedStoryCounts } from '../../../actions/topicActions';

const localMessages = {
  title: { id: 'topic.summary.geo.title', defaultMessage: 'Geographic Attention' },
  helpIntro: { id: 'topic.summary.geo.info',
    defaultMessage: '<p>This is a map of the countries stories within this Topic are about. We\'ve extracted the places mentioned in each story and the ones mentioned most make a story "about" that place. Darker countries have more stories about them.</p>' },
  notEnoughData: { id: 'topic.summary.geo.notEnoughData',
    defaultMessage: '<i>Sorry, but only {pct} of the stories have been processed to add the places they are about.  We can\'t gaurantee the accuracy of partial results, so we can\'t show a report of the geographic attention right now.  If you are really curious, you can download the CSV using the link in the top-right of this box, but don\'t trust those numbers as fully accurate. Email us if you want us to process this topic to add geographic attention.</i>',
  },
};

const COVERAGE_REQUIRED = 0.7; // need > this many of the stories tagged to show the results

class GeoTagSummaryContainer extends React.Component {
  downloadCsv = () => {
    const { topicId, filters } = this.props;
    const url = `/api/topics/${topicId}/geo-tags/counts.csv?${filtersAsUrlParams(filters)}`;
    window.location = url;
  }

  render() {
    const { data, coverage } = this.props;
    const { formatNumber } = this.props.intl;
    const coverageRatio = coverage.count / coverage.total;
    let content;
    if (coverageRatio > COVERAGE_REQUIRED) {
      content = (<GeoChart data={data} countryMaxColorScale={getBrandLightColor()} backgroundColor="#f5f5f5" />);
    } else {
      content = (
        <p>
          <FormattedHTMLMessage
            {...localMessages.notEnoughData}
            values={{ pct: formatNumber(coverageRatio, { style: 'percent', maximumFractionDigits: 2 }) }}
          />
        </p>
      );
    }
    return (
      <React.Fragment>
        {content}
        <Permissioned onlyRole={PERMISSION_LOGGED_IN}>
          <div className="actions">
            <ActionMenu actionTextMsg={messages.downloadOptions}>
              <MenuItem
                className="action-icon-menu-item"
                onClick={this.downloadCsv}
              >
                <ListItemText><FormattedMessage {...messages.downloadCSV} /></ListItemText>
                <ListItemIcon><DownloadButton /></ListItemIcon>
              </MenuItem>
            </ActionMenu>
          </div>
        </Permissioned>
      </React.Fragment>
    );
  }
}

GeoTagSummaryContainer.propTypes = {
  // from state
  data: PropTypes.array.isRequired,
  coverage: PropTypes.object.isRequired,
  fetchStatus: PropTypes.string,
  // from parent
  topicId: PropTypes.number.isRequired,
  filters: PropTypes.object.isRequired,
  // from composition
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.geotags.fetchStatus,
  data: state.topics.selected.geotags.entities,
  coverage: state.topics.selected.geotags.coverage,
});

const fetchAsyncData = (dispatch, props) => dispatch(fetchTopicGeocodedStoryCounts(props.topicId, props.filters));

export default
injectIntl(
  connect(mapStateToProps)(
    withSummary(localMessages.title, localMessages.helpIntro, messages.heatMapHelpText)(
      withFilteredAsyncData(
        GeoTagSummaryContainer,
        fetchAsyncData
      )
    )
  )
);
