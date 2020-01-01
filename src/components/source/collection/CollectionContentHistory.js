/* eslint-disable no-return-assign */
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { Link } from 'react-router';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ActionMenu from '../../common/ActionMenu';
import { fetchCollectionSourceSplitStoryHistoricalCounts } from '../../../actions/sourceActions';
import withAsyncData from '../../common/hocs/AsyncDataContainer';
import { getBrandDarkColor } from '../../../styles/colors';
import { DownloadButton } from '../../common/IconButton';
import AttentionOverTimeChart, { dataAsSeries } from '../../vis/AttentionOverTimeChart';
import PageTitle from '../../common/PageTitle';
import withAttentionAggregation from '../../common/hocs/AttentionAggregation';
import { PAST_WEEK } from '../../../lib/dateUtil';
import messages from '../../../resources/messages';

const localMessages = {
  title: { id: 'collection.contentHistory.title', defaultMessage: 'Content History' },
  counts: { id: 'collection.contentHistory.counts', defaultMessage: '{total} Stories' },
};

const CollectionContentHistory = ({ collection, historicalCounts, intl, attentionAggregationMenuItems, selectedTimePeriod }) => (
  <>
    <PageTitle value={[localMessages.title, collection.label]} />
    <Grid>
      <Row>
        <Col lg={8}>
          <h1>
            {collection.label} - <FormattedMessage {...localMessages.title} />
          </h1>
        </Col>
        <Col lg={4}>
          <div className="actions">
            <ActionMenu actionTextMsg={messages.downloadOptions}>
              <MenuItem
                className="action-icon-menu-item"
                onClick={() => window.location = `/api/collections/${collection.tags_id}/sources/story-split/historical-counts.csv`}
              >
                <ListItemText><FormattedMessage {...messages.downloadCSV} /></ListItemText>
                <ListItemIcon><DownloadButton /></ListItemIcon>
              </MenuItem>
            </ActionMenu>
            <ActionMenu actionTextMsg={messages.viewOptions}>
              {attentionAggregationMenuItems}
            </ActionMenu>
          </div>
        </Col>
      </Row>
      {historicalCounts.map(source => (
        <Row key={source.media_id}>
          <Col lg={2}>
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
          <Col lg={10}>
            <AttentionOverTimeChart
              showLegend={false}
              series={[{
                id: 0,
                name: source.media_name,
                color: getBrandDarkColor(),
                ...dataAsSeries(source.storiesOverTime),
                showInLegend: false,
              }]}
              height={150}
              interval={selectedTimePeriod}
              filename={`source-${source.media_id}-history`}
            />
          </Col>
        </Row>
      ))}
    </Grid>
  </>
);

CollectionContentHistory.propTypes = {
  intl: PropTypes.object.isRequired,
  // from state
  collectionId: PropTypes.number.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  collection: PropTypes.object.isRequired,
  historicalCounts: PropTypes.array.isRequired,
  // from compositional chain
  selectedTimePeriod: PropTypes.string.isRequired,
  attentionAggregationMenuItems: PropTypes.array.isRequired,
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
      withAttentionAggregation(
        CollectionContentHistory, PAST_WEEK
      ),
    ),
  )
);
