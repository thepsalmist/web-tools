import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ActionMenu from '../../common/ActionMenu';
import withHelp from '../../common/hocs/HelpfulContainer';
import messages from '../../../resources/messages';
import MediaOutlinkTableContainer from './MediaOutlinkTableContainer';
import MediaOutlinkTreeMapContainer from './MediaOutlinkTreeMapContainer';
import DataCard from '../../common/DataCard';
import SVGAndCSVMenu from '../../common/SVGAndCSVMenu';
import { downloadSvg } from '../../util/svg';
import { filtersAsUrlParams } from '../../util/location';
import { topicDownloadFilename } from '../../util/topicUtil';

const VIEW_TABLE = 'VIEW_TABLE';
const VIEW_TREE = 'VIEW_TREE';
const TREE_MAP_DOM_ID = 'tree-map';

const localMessages = {
  title: { id: 'media.outlinks.title', defaultMessage: 'Outlinks' },
  helpTitle: { id: 'media.outlinks.help.title', defaultMessage: 'About Media Outlinks' },
  helpIntro: { id: 'media.outlinks.help.intro', defaultMessage: '<p>This is a table of stories linked to in stories published by this Media Source within the Topic.</p>' },
  downloadLinkCSV: { id: 'media.outlinks.download.csv', defaultMessage: 'Download CSV with All Outlinks' },
  modeTree: { id: 'media.outlinks.tree', defaultMessage: 'View Tree Map' },
  modeTable: { id: 'media.outlinks.table', defaultMessage: 'View Table' },
};

class MediaOutlinkContainer extends React.Component {
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
    const { media, topicId, filters } = this.props;
    const filtersAsParams = filtersAsUrlParams(filters);
    const url = `/api/topics/${topicId}/media/${media.media_id}/outlinks.csv?${filtersAsParams}`;
    window.location = url;
  }

  handleDownloadSvg = (fileName) => {
    // a little crazy, but it works (we have to just walk the DOM rendered by the library we are using)
    const domId = TREE_MAP_DOM_ID;
    const svgNode = document.getElementById(domId).children[0].children[0];
    downloadSvg(fileName, svgNode);
  }

  render() {
    const { topicId, topicName, filters, media, helpButton, showTweetCounts } = this.props;
    const { formatMessage } = this.props.intl;
    let content = <MediaOutlinkTableContainer topicId={topicId} mediaId={media.media_id} showTweetCounts={showTweetCounts} />;
    if (this.state.view === VIEW_TREE) {
      content = <MediaOutlinkTreeMapContainer topicId={topicId} topicName={topicName} media={media} />;
    }
    const svgFilename = `${topicDownloadFilename(topicName, filters)}-outlinks-to-${media.media_id})`;
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
              disabled={this.state.view === VIEW_TABLE}
              onClick={() => this.setView(VIEW_TABLE)}
            >
              <ListItemText><FormattedMessage {...localMessages.modeTable} /> </ListItemText>
            </MenuItem>
            <MenuItem
              className="action-icon-menu-item"
              disabled={this.state.view === VIEW_TREE}
              onClick={() => this.setView(VIEW_TREE)}
            >
              <ListItemText><FormattedMessage {...localMessages.modeTree} /></ListItemText>
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

MediaOutlinkContainer.propTypes = {
  // from composition chain
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  topicName: PropTypes.string.isRequired,
  media: PropTypes.object.isRequired,
  // from state
  filters: PropTypes.object.isRequired,
  showTweetCounts: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  filters: state.topics.selected.filters,
  showTweetCounts: Boolean(state.topics.selected.info.ch_monitor_id),
  media: state.topics.selected.mediaSource.info,
});

export default
injectIntl(
  connect(mapStateToProps)(
    withHelp(localMessages.helpTitle, [localMessages.helpIntro, messages.storiesTableHelpText])(
      MediaOutlinkContainer
    )
  )
);
