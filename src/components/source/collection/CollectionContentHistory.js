import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { Link } from 'react-router';
import { Helmet } from 'react-helmet';
import { fetchCollectionSourceSplitStoryHistoricalCounts } from '../../../actions/sourceActions';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import { getBrandDarkColor } from '../../../styles/colors';
import { DownloadButton } from '../../common/IconButton';
import AttentionOverTimeChart from '../../vis/AttentionOverTimeChart';

const localMessages = {
  title: { id: 'collection.contentHistory.title', defaultMessage: 'Total Stories over Time' },
  counts: { id: 'collection.contentHistory.counts', defaultMessage: '{total} Stories' },
};

class CollectionContentHistory extends React.Component {
  downloadCsv = (evt) => {
    const { collection } = this.props;
    if (evt) {
      evt.preventDefault();
    }
    const url = `/api/collections/${collection.tags_id}/sources/story-split/historical-counts.csv`;
    window.location = url;
  }

  render() {
    const { collection, historicalCounts } = this.props;
    const { formatMessage, formatNumber } = this.props.intl;
    const titleHandler = parentTitle => `${formatMessage(localMessages.title)} | ${parentTitle}`;
    return (
      <div>
        <Helmet><title>{titleHandler()}</title></Helmet>
        <Grid>
          <Row>
            <Col lg={10}>
              <h1>
                {collection.label} - <FormattedMessage {...localMessages.title} />
              </h1>
            </Col>
            <Col lg={2}>
              <DownloadButton onClick={this.downloadCsv} />
            </Col>
          </Row>
          {historicalCounts.map(source => (
            <Row key={source.media_id}>
              <Col lg={2} xs={12}>
                <h3><Link to={`/sources/${source.media_id}`}>{source.media_name}</Link></h3>
                <p>
                  <FormattedMessage
                    {...localMessages.counts}
                    values={{
                      total: formatNumber(source.total_story_count),
                    }}
                  />
                </p>
              </Col>
              <Col lg={8} xs={12}>
                <AttentionOverTimeChart
                  showLegend={false}
                  series={[{
                    id: 0,
                    name: source.media_name,
                    color: getBrandDarkColor(),
                    data: source.storiesOverTime.map(c => [c.date, c.count]),
                    showInLegend: false,
                  }]}
                  height={150}
                  filename={`source-${source.media_id}-history`}
                />
              </Col>
            </Row>
          ))}
        </Grid>
      </div>
    );
  }
}

CollectionContentHistory.propTypes = {
  intl: PropTypes.object.isRequired,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  // from context
  location: PropTypes.object.isRequired,
  // from state
  collectionId: PropTypes.number.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  collection: PropTypes.object.isRequired,
  historicalCounts: PropTypes.array.isRequired,
  // from dispatch
};

const mapStateToProps = state => ({
  collectionId: state.sources.collections.selected.id,
  collection: state.sources.collections.selected.collectionDetails.object,
  fetchStatus: state.sources.collections.selected.historicalSplitStoryCounts.fetchStatus,
  selectedTimePeriod: state.sources.collections.selected.historicalSplitStoryCounts.timePeriod,
  historicalCounts: state.sources.collections.selected.historicalSplitStoryCounts.counts,
});

const mapDispatchToProps = dispatch => ({
  fetchData: (collectionId) => {
    dispatch(fetchCollectionSourceSplitStoryHistoricalCounts(collectionId));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(stateProps.collectionId, stateProps.selectedTimePeriod);
    },
  });
}

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    withAsyncFetch(
      CollectionContentHistory
    ),
  )
);
