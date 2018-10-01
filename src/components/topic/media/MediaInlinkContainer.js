import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { fetchMediaInlinks, sortMediaInlinks } from '../../../actions/topicActions';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import withHelp from '../../common/hocs/HelpfulContainer';
import ActionMenu from '../../common/ActionMenu';
import messages from '../../../resources/messages';
import TreeMap from '../../vis/TreeMap';
import TopicStoryTable from '../TopicStoryTable';
import DataCard from '../../common/DataCard';
import { filtersAsUrlParams } from '../../util/location';
import { DownloadButton } from '../../common/IconButton';

const STORIES_TO_SHOW = 10;
const VIEW_TABLE = 'VIEW_TABLE';
const VIEW_TREE = 'VIEW_TREE';

const localMessages = {
  helpTitle: { id: 'media.inlinks.help.title', defaultMessage: 'About Media Inlinks' },
  helpIntro: { id: 'media.inlinks.help.intro', defaultMessage: '<p>This is a table of stories that link to stories published by this Media Source within the Topic.</p>' },
  downloadLinkCSV: { id: 'media.inlinks.download.csv', defaultMessage: 'Download InLink Csv' },
  modeTree: { id: 'media.inlinks.tree', defaultMessage: 'View Tree Map' },
  modeTable: { id: 'media.inlinks.table', defaultMessage: 'View Table' },
};

class MediaInlinksContainer extends React.Component {
  state = {
    view: VIEW_TABLE, // which view to show (see view constants above)
  };

  componentWillReceiveProps(nextProps) {
    const { fetchData, filters, sort } = this.props;
    if ((nextProps.filters !== filters) || (nextProps.sort !== sort)) {
      fetchData(nextProps);
    }
  }

  onChangeSort = (newSort) => {
    const { sortData } = this.props;
    sortData(newSort);
  }

  setView = (nextView) => {
    this.setState({ view: nextView });
  }

  downloadCsv = () => {
    const { mediaId, topicId, filters } = this.props;
    const filtersAsParams = filtersAsUrlParams(filters);
    const url = `/api/topics/${topicId}/media/${mediaId}/inlinks.csv?${filtersAsParams}`;
    window.location = url;
  }

  render() {
    const { inlinkedStories, topicId, helpButton, showTweetCounts } = this.props;
    let content = <TopicStoryTable stories={inlinkedStories} showTweetCounts={showTweetCounts} topicId={topicId} onChangeSort={this.onChangeSort} />;
    if (this.state.view === VIEW_TREE) {
      const inlinkedVals = inlinkedStories.map(i => ({ name: i.media_name, value: i.inlink_count }));
      content = <TreeMap data={inlinkedVals} title="test" />;
    }
    return (
      <DataCard>
        <div className="actions">
          <ActionMenu actionTextMsg={messages.viewOptions}>
            <MenuItem
              className="action-icon-menu-item"
              disabled={this.state.view === VIEW_TREE}
              onClick={() => this.setView(VIEW_TREE)}
            >
              <ListItemText><FormattedMessage {...localMessages.modeTree} /></ListItemText>
            </MenuItem>
            <MenuItem
              className="action-icon-menu-item"
              disabled={this.state.view === VIEW_TABLE}
              onClick={() => this.setView(VIEW_TABLE)}
            >
              <ListItemText><FormattedMessage {...localMessages.modeTable} /> </ListItemText>
            </MenuItem>
            <MenuItem
              className="action-icon-menu-item"
              disabled={this.state.editing} // can't download until done editing
              onClick={() => this.downloadCsv(1)}
            >
              <ListItemText><FormattedMessage {...localMessages.downloadLinkCSV} /></ListItemText>
              <ListItemIcon>
                <DownloadButton />
              </ListItemIcon>
            </MenuItem>
          </ActionMenu>
        </div>
        <h2>
          <FormattedMessage {...messages.inlinks} />
          {helpButton}
        </h2>
        {content}
      </DataCard>
    );
  }
}

MediaInlinksContainer.propTypes = {
  // from composition chain
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
  // from parent
  mediaId: PropTypes.number.isRequired,
  topicId: PropTypes.number.isRequired,
  // from mergeProps
  asyncFetch: PropTypes.func.isRequired,
  // from fetchData
  fetchData: PropTypes.func.isRequired,
  sortData: PropTypes.func.isRequired,
  // from state
  sort: PropTypes.string.isRequired,
  filters: PropTypes.object.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  inlinkedStories: PropTypes.array.isRequired,
  showTweetCounts: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.mediaSource.inlinks.fetchStatus,
  inlinkedStories: state.topics.selected.mediaSource.inlinks.stories,
  sort: state.topics.selected.mediaSource.inlinks.sort,
  filters: state.topics.selected.filters,
  showTweetCounts: Boolean(state.topics.selected.info.ch_monitor_id),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (stateProps) => {
    const params = {
      ...stateProps.filters,
      sort: stateProps.sort,
      limit: STORIES_TO_SHOW,
    };
    dispatch(fetchMediaInlinks(ownProps.topicId, ownProps.mediaId, params));
  },
  sortData: (sort) => {
    dispatch(sortMediaInlinks(sort));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(stateProps);
    },
  });
}

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    withHelp(localMessages.helpTitle, [localMessages.helpIntro, messages.storiesTableHelpText])(
      withAsyncFetch(
        MediaInlinksContainer
      )
    )
  )
);
