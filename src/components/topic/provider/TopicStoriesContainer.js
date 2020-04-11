import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { DownloadButton } from '../../common/IconButton';
import withSampleSize from '../../common/hocs/SampleSize';
import withSorting from '../../common/hocs/Sorted';
import withCsvDownloadNotifyContainer from '../../common/hocs/CsvDownloadNotifyContainer';
import { combineQueryParams, filtersAsUrlParams, formatAsUrlParams } from '../../util/location';
import withFilteredAsyncData from '../FilteredAsyncDataContainer';
import TopicStoryTableContainer from '../TopicStoryTableContainer';
import { fetchTopicProviderStories } from '../../../actions/topicActions';
import DataCard from '../../common/DataCard';
import ActionMenu from '../../common/ActionMenu';
import messages from '../../../resources/messages';

const TopicStoriesContainer = (props) => (
  <DataCard>
    <h2><FormattedHTMLMessage {...props.titleMsg} /></h2>
    <TopicStoryTableContainer
      stories={props.stories}
      {...props}
    />
    <div className="action-menu-set">
      <ActionMenu actionTextMsg={messages.downloadOptions}>
        <MenuItem
          className="action-icon-menu-item"
          onClick={() => {
            const downloadUrl = `/api/topics/${props.topicInfo.topics_id}/provider/stories.csv?${filtersAsUrlParams({
              ...props.filters, q: combineQueryParams(props.filters.q, props.extraQueryClause) })}&${formatAsUrlParams(props.extraArgs)}`;
            window.location = downloadUrl;
          }}
        >
          <ListItemText><FormattedMessage {...messages.download} /></ListItemText>
          <ListItemIcon>
            <DownloadButton />
          </ListItemIcon>
        </MenuItem>
      </ActionMenu>
    </div>
  </DataCard>
);

TopicStoriesContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  sort: PropTypes.string,
  // from parent
  titleMsg: PropTypes.object.isRequired,
  uid: PropTypes.string.isRequired, // too support mulitple on one page
  extraArgs: PropTypes.object, // any extra properties you can relayed to the server in the call for listing stories
  extraQueryClause: PropTypes.string,
  responsePrefix: PropTypes.string, // if set, story list will be in `responsePrefixStories` instead of `stories`
  // from state
  topicInfo: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  stories: PropTypes.array,
  fetchStatus: PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  topicInfo: state.topics.selected.info,
  filters: state.topics.selected.filters,
  fetchStatus: state.topics.selected.provider.stories.fetchStatus,
  stories: state.topics.selected.provider.stories.results[ownProps.uid] ? state.topics.selected.provider.stories.results[ownProps.uid].stories : [],
});

const fetchAsyncData = (dispatch, props) => dispatch(fetchTopicProviderStories(props.topicInfo.topics_id, {
  ...props.filters,
  q: combineQueryParams(props.filters.q, props.extraQueryClause),
  ...props.extraArgs,
  uid: props.uid,
  sort: props.sort,
}));

export default
injectIntl(
  connect(mapStateToProps)(
    withSampleSize(
      withSorting(
        withCsvDownloadNotifyContainer(
          withFilteredAsyncData(fetchAsyncData, ['sort'])(
            TopicStoriesContainer,
          )
        )
      )
    )
  )
);
