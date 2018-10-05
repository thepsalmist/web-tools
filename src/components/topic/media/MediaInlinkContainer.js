import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import { fetchMediaInlinks, sortMediaInlinks } from '../../../actions/topicActions';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import withHelp from '../../common/hocs/HelpfulContainer';
import SVGAndCSVMenu from '../../common/SVGAndCSVMenu';
import ActionMenu from '../../common/ActionMenu';
import messages from '../../../resources/messages';
import TreeMap from '../../vis/TreeMap';
import TopicStoryTable from '../TopicStoryTable';
import DataCard from '../../common/DataCard';
import { downloadSvg } from '../../util/svg';
import { filtersAsUrlParams } from '../../util/location';
import { topicDownloadFilename } from '../../util/topicUtil';

const STORIES_TO_SHOW = 10;
const VIEW_TABLE = 'VIEW_TABLE';
const VIEW_TREE = 'VIEW_TREE';
const TREE_MAP_DOM_ID = 'tree-map';


const localMessages = {
  title: { id: 'media.inlinks.title', defaultMessage: 'Top Inlinks' },
  helpTitle: { id: 'media.inlinks.help.title', defaultMessage: 'About Media Inlinks' },
  helpIntro: { id: 'media.inlinks.help.intro', defaultMessage: '<p>This is a table of stories that link to stories published by this Media Source within the Topic.</p>' },
  downloadLinkCSV: { id: 'media.inlinks.download.csv', defaultMessage: 'Download CSV with All Inlinks' },
  modeTree: { id: 'media.inlinks.tree', defaultMessage: 'View Tree Map' },
  modeTable: { id: 'media.inlinks.table', defaultMessage: 'View Table' },
  treeMap: { id: 'media.inlinks.treemap', defaultMessage: 'Inlink Tree Map for {name}' },
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
    const url = `/api/topics/${topicId}/media/${mediaId}/inlinks.csv?${filtersAsParams}`;
    window.location = url;
  }

  render() {
    const { inlinkedStories, topicId, mediaId, helpButton, showTweetCounts, topicName, filters } = this.props;
    const { formatMessage } = this.props.intl;
    let content = <TopicStoryTable stories={inlinkedStories} showTweetCounts={showTweetCounts} topicId={topicId} onChangeSort={this.onChangeSort} />;
    if (this.state.view === VIEW_TREE) {
      // setup data so the TreeMap can consume it
      const justIds = [...new Set(inlinkedStories.map(d => d.media_id))];
      const groups = justIds.map(id => ({ id, elements: inlinkedStories.filter(e => e.media_id === id) }));
      const summedInlinks = groups.map(g => ({ id: g.id, name: g.elements[0].media_name, value: g.elements.reduce((acc, ele) => acc + ele.inlink_count, 0) }));

      content = <TreeMap domId={TREE_MAP_DOM_ID} data={summedInlinks} title={formatMessage(localMessages.treeMap, { name: topicName })} />;
    }
    const svgFilename = `${topicDownloadFilename(topicName, filters)}-inlinks-to-${mediaId})`;
    return (
      <DataCard>
        <div className="actions">
          <ActionMenu actionTextMsg={messages.downloadOptions}>
            <SVGAndCSVMenu
              downloadCsv={this.downloadCsv}
              downloadSvg={this.state.view === VIEW_TREE ? () => downloadSvg(svgFilename, TREE_MAP_DOM_ID) : null}
              label={formatMessage(localMessages.title)}
            />
          </ActionMenu>
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
          </ActionMenu>
        </div>
        <h2>
          <FormattedMessage {...localMessages.title} />
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
  topicName: PropTypes.string.isRequired,
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
      limit: stateProps.view === VIEW_TABLE ? STORIES_TO_SHOW : '',
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
