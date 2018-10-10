import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import withHelp from '../../common/hocs/HelpfulContainer';
import SVGAndCSVMenu from '../../common/SVGAndCSVMenu';
import ActionMenu from '../../common/ActionMenu';
import messages from '../../../resources/messages';
import MediaInlinkTableContainer from './MediaInlinkTableContainer';
import MediaInlinkTreeMapContainer from './MediaInlinkTreeMapContainer';
import DataCard from '../../common/DataCard';
import { downloadSvg } from '../../util/svg';
import { filtersAsUrlParams } from '../../util/location';
import { topicDownloadFilename } from '../../util/topicUtil';

const VIEW_TABLE = 'VIEW_TABLE';
const VIEW_TREE = 'VIEW_TREE';
const TREE_MAP_DOM_ID = 'tree-map';


const localMessages = {
  title: { id: 'media.inlinks.title', defaultMessage: 'Inlinks' },
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

  shouldComponentUpdate(nextProps, nextState) {
    return (this.state.view !== nextState.view);
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

  handleDownloadSvg = (fileName) => {
    // a little crazy, but it works (we have to just walk the DOM rendered by the library we are using)
    const domId = TREE_MAP_DOM_ID;
    const svgNode = document.getElementById(domId).children[0].children[0];
    downloadSvg(fileName, svgNode);
  }

  render() {
    const { topicId, mediaId, showTweetCounts, media, helpButton, topicName, filters } = this.props;
    const { formatMessage } = this.props.intl;
    let content = <MediaInlinkTableContainer topicId={topicId} mediaId={media.media_id} showTweetCounts={showTweetCounts} />;
    if (this.state.view === VIEW_TREE) {
      // setup data so the TreeMap can consume it
      content = <MediaInlinkTreeMapContainer topicId={topicId} topicName={topicName} media={media} />;
    }
    const svgFilename = `${topicDownloadFilename(topicName, filters)}-inlinks-to-${mediaId})`;
    return (
      <DataCard>
        <div className="actions">
          <ActionMenu actionTextMsg={messages.downloadOptions}>
            <SVGAndCSVMenu
              downloadCsv={this.downloadCsv}
              downloadSvg={this.state.view === VIEW_TREE ? () => this.handleDownloadSvg(svgFilename) : null}
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
  media: PropTypes.object.isRequired,
  // from state
  sort: PropTypes.string.isRequired,
  filters: PropTypes.object.isRequired,
  showTweetCounts: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  sort: state.topics.selected.mediaSource.inlinks.sort,
  filters: state.topics.selected.filters,
  showTweetCounts: Boolean(state.topics.selected.info.ch_monitor_id),
  media: state.topics.selected.mediaSource.info,
});

export default
injectIntl(
  connect(mapStateToProps)(
    withHelp(localMessages.helpTitle, [localMessages.helpIntro, messages.storiesTableHelpText])(
      MediaInlinksContainer
    )
  )
);
