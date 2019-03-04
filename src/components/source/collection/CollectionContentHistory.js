/* eslint-disable no-return-assign */
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { Link } from 'react-router';
import { fetchCollectionSourceSplitStoryHistoricalCounts } from '../../../actions/sourceActions';
import withAsyncData from '../../common/hocs/AsyncDataContainer';
import { getBrandDarkColor } from '../../../styles/colors';
import { DownloadButton } from '../../common/IconButton';
import AttentionOverTimeChart from '../../vis/AttentionOverTimeChart';
import PageTitle from '../../common/PageTitle';

const localMessages = {
  title: { id: 'collection.contentHistory.title', defaultMessage: 'Content History' },
  counts: { id: 'collection.contentHistory.counts', defaultMessage: '{total} Stories' },
};

const CollectionContentHistory = ({ collection, historicalCounts, intl }) => (
  <React.Fragment>
    <PageTitle value={[localMessages.title, collection.label]} />
    <Grid>
      <Row>
        <Col lg={10}>
          <h1>
            {collection.label} - <FormattedMessage {...localMessages.title} />
          </h1>
        </Col>
        <Col lg={2}>
          <DownloadButton onClick={() => window.location = `/api/collections/${collection.tags_id}/sources/story-split/historical-counts.csv`} />
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
                  total: intl.formatNumber(source.total_story_count),
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
  </React.Fragment>
);

CollectionContentHistory.propTypes = {
  intl: PropTypes.object.isRequired,
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

const fetchAsyncData = (dispatch, { collectionId }) => dispatch(fetchCollectionSourceSplitStoryHistoricalCounts(collectionId));

export default
injectIntl(
  connect(mapStateToProps)(
    withAsyncData(fetchAsyncData)(
      CollectionContentHistory
    ),
  )
);
