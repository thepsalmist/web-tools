import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { fetchMediaOutlinks, sortMediaOutlinks } from '../../../actions/topicActions';
import ActionMenu from '../../common/ActionMenu';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import withHelp from '../../common/hocs/HelpfulContainer';
import messages from '../../../resources/messages';
import TopicStoryTable from '../TopicStoryTable';
import TreeMap from '../../vis/TreeMap';
import DataCard from '../../common/DataCard';
import { filtersAsUrlParams } from '../../util/location';
import { DownloadButton } from '../../common/IconButton';

const STORIES_TO_SHOW = 10;
const VIEW_TABLE = 'VIEW_TABLE';
const VIEW_TREE = 'VIEW_TREE';

const localMessages = {
  helpTitle: { id: 'media.outlinks.help.title', defaultMessage: 'About Media Outlinks' },
  helpIntro: { id: 'media.outlinks.help.intro', defaultMessage: '<p>This is a table of stories linked to in stories published by this Media Source within the Topic.</p>' },
  downloadLinkCSV: { id: 'media.inlinks.download.csv', defaultMessage: 'Download InLink Csv' },
  modeTree: { id: 'media.inlinks.tree', defaultMessage: 'View Tree Map' },
  modeTable: { id: 'media.inlinks.table', defaultMessage: 'View Table' },
};

class MediaOutlinksContainer extends React.Component {
  state = {
    view: VIEW_TABLE, // which view to show (see view constants above)
  };

  componentWillReceiveProps(nextProps) {
    const { fetchData, filters, sort } = this.props;
    if ((nextProps.filters !== filters) || (nextProps.sort !== sort)) {
      fetchData(nextProps);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (this.state.view !== nextState.view);
  }

  onChangeSort = (newSort) => {
    const { sortData } = this.props;
    sortData(newSort);
  }

  setView = (viewMode) => {
    this.setState({ view: viewMode });
  }

  downloadCsv = () => {
    const { mediaId, topicId, filters } = this.props;
    const filtersAsParams = filtersAsUrlParams(filters);
    const url = `/api/topics/${topicId}/media/${mediaId}/outlinks.csv?${filtersAsParams}`;
    window.location = url;
  }

  render() {
    const { outlinkedStories, topicId, helpButton, showTweetCounts } = this.props;
    const { formatMessage } = this.props.intl;
    let content = <TopicStoryTable stories={outlinkedStories} showTweetCounts={showTweetCounts} topicId={topicId} onChangeSort={this.onChangeSort} />;
    if (this.state.view === VIEW_TREE) {
      const outlinkedVals = outlinkedStories.map(i => ({ name: i.title, value: i.inlink_count }));
      content = <TreeMap data={outlinkedVals} title="test" />;
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
                <DownloadButton tooltip={formatMessage(messages.download)} onClick={() => this.downloadCsv(formatMessage(localMessages.review))} />
              </ListItemIcon>
            </MenuItem>
          </ActionMenu>
        </div>
        <h2>
          <FormattedMessage {...messages.outlinks} />
          {helpButton}
        </h2>
        {content}
      </DataCard>
    );
  }
}

MediaOutlinksContainer.propTypes = {
  // from composition chain
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
  // from parent
  mediaId: PropTypes.number.isRequired,
  topicId: PropTypes.number.isRequired,
  // from mergeProps
  asyncFetch: PropTypes.func.isRequired,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  sortData: PropTypes.func.isRequired,
  // from state
  sort: PropTypes.string.isRequired,
  filters: PropTypes.object.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  outlinkedStories: PropTypes.array.isRequired,
  showTweetCounts: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.mediaSource.outlinks.fetchStatus,
  outlinkedStories: state.topics.selected.mediaSource.outlinks.stories,
  sort: state.topics.selected.mediaSource.outlinks.sort,
  filters: state.topics.selected.filters,
  showTweetCounts: Boolean(state.topics.selected.info.ch_monitor_id),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (stateProps) => {
    const params = {
      ...stateProps.filters,
      sort: stateProps.sort,
      limit: stateProps.view === VIEW_TABLE ? STORIES_TO_SHOW : '',
    };
    dispatch(fetchMediaOutlinks(ownProps.topicId, ownProps.mediaId, params)); // fetch the info we need
  },
  sortData: (sort) => {
    dispatch(sortMediaOutlinks(sort));
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
        MediaOutlinksContainer
      )
    )
  )
);
