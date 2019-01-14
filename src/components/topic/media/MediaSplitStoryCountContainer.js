import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import withFilteredAsyncData from '../FilteredAsyncDataContainer';
import withAttentionAggregation from '../../common/hocs/AttentionAggregation';
import withHelp from '../../common/hocs/HelpfulContainer';
import AttentionOverTimeChart from '../../vis/AttentionOverTimeChart';
import { fetchMediaSplitStoryCounts } from '../../../actions/topicActions';
import messages from '../../../resources/messages';
import { DownloadButton } from '../../common/IconButton';
import ActionMenu from '../../common/ActionMenu';
import DataCard from '../../common/DataCard';
import { getBrandDarkColor } from '../../../styles/colors';

const localMessages = {
  title: { id: 'media.splitStoryCount.title', defaultMessage: 'Total Stories in this Media Source' },
  helpTitle: { id: 'media.splitStoryCount.help.title', defaultMessage: 'About Media Attention' },
  helpText: { id: 'media.splitStoryCount.help.text',
    defaultMessage: '<p>This chart shows you the coverage of this Topic over time by this Media Source. This is the total number of stories from this Media Source within this topic.</p>',
  },
  downloadCsv: { id: 'media.splitStoryCount.downloadCsv', defaultMessage: 'Download CSV of Stories per Day' },
};

const MediaSplitStoryCountContainer = (props) => {
  const { total, counts, helpButton, selectedTimePeriod, filters, topicId, mediaId } = props;
  return (
    <DataCard>
      <div className="actions">
        <ActionMenu actionTextMsg={messages.downloadOptions}>
          <MenuItem
            onClick={() => {
              const url = `/api/topics/${topicId}/media/${mediaId}/split-story/count.csv?snapshotId=${filters.snapshotId}&timespanId=${filters.timespanId}`;
              window.location = url;
            }}
          >
            <ListItemText>
              <FormattedMessage {...localMessages.downloadCsv} />
            </ListItemText>
            <ListItemIcon>
              <DownloadButton />
            </ListItemIcon>
          </MenuItem>
        </ActionMenu>
        <ActionMenu actionTextMsg={messages.viewOptions}>
          {props.attentionAggregationMenuItems}
        </ActionMenu>
      </div>
      <h2>
        <FormattedMessage {...localMessages.title} />
        {helpButton}
      </h2>
      <AttentionOverTimeChart
        total={total}
        data={counts}
        height={200}
        lineColor={getBrandDarkColor()}
        interval={selectedTimePeriod}
      />
    </DataCard>
  );
};

MediaSplitStoryCountContainer.propTypes = {
  // from composition chain
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
  attentionAggregationMenuItems: PropTypes.array.isRequired,
  selectedTimePeriod: PropTypes.string.isRequired,
  filters: PropTypes.object.isRequired,
  // passed in
  topicId: PropTypes.number.isRequired,
  mediaId: PropTypes.number.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  total: PropTypes.number,
  counts: PropTypes.array,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.mediaSource.splitStoryCount.fetchStatus,
  total: state.topics.selected.mediaSource.splitStoryCount.total,
  counts: state.topics.selected.mediaSource.splitStoryCount.counts,
});

const fetchAsyncData = (dispatch, props) => dispatch(fetchMediaSplitStoryCounts(props.topicId, props.mediaId, props.filters));

export default
injectIntl(
  connect(mapStateToProps)(
    withHelp(localMessages.helpTitle, [localMessages.helpText, messages.attentionChartHelpText])(
      withAttentionAggregation(
        withFilteredAsyncData(fetchAsyncData)(
          MediaSplitStoryCountContainer,
        )
      )
    )
  )
);
