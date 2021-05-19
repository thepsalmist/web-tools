import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';
import Link from 'react-router/lib/Link';
import { push } from 'react-router-redux';
import { fetchSourceFeeds, scrapeSourceFeeds, fetchSourceDetails } from '../../../actions/sourceActions';
import withAsyncData from '../../common/hocs/AsyncDataContainer';
import MediaSourceIcon from '../../common/icons/MediaSourceIcon';
import SourceFeedTable from '../SourceFeedTable';
import messages from '../../../resources/messages';
import { DownloadButton } from '../../common/IconButton';
import AppButton from '../../common/AppButton';
import Permissioned from '../../common/Permissioned';
import { getUserRoles, hasPermissions, PERMISSION_MEDIA_EDIT } from '../../../lib/auth';
import { updateFeedback } from '../../../actions/appActions';
import { SOURCE_SCRAPE_STATE_QUEUED, SOURCE_SCRAPE_STATE_RUNNING } from '../../../reducers/sources/sources/selected/sourceDetails';
import PageTitle from '../../common/PageTitle';
import TabSelector from '../../common/TabSelector';
import SourceSitemapsContainer from './sitemaps/SourceSitemapsContainer';

const localMessages = {
  pageTitle: { id: 'source.feeds.pageTitle', defaultMessage: 'Feeds' },
  title: { id: 'source.feeds.title', defaultMessage: '{name} | Source Feeds | Media Cloud' },
  sourceFeedsTitle: { id: 'source.details.feeds.title', defaultMessage: '{name}: Feeds' },
  add: { id: 'source.details.feeds.add', defaultMessage: 'Add A Feed' },
  activeLabel: { id: 'source.details.feed.active', defaultMessage: 'Active' },
  inactiveLabel: { id: 'source.details.feed.inactive', defaultMessage: 'Inactive' },
  rssFeeds: { id: 'source.details.feed.rssFeeds', defaultMessage: 'RSS Feeds' },
  podcasts: { id: 'source.details.feed.podcasts', defaultMessage: 'Podcasts' },
  sitemaps: { id: 'source.details.feed.sitemaps', defaultMessage: 'Sitemaps' },
};

class SourceFeedContainer extends React.Component {
  state = {
    selectedViewIndex: 0,
  };

  downloadCsv = () => {
    const { sourceId } = this.props;
    const url = `/api/sources/${sourceId}/feeds/feeds.csv`;
    window.location = url;
  }

  getSelectedFeedType = () => {
    const { selectedViewIndex } = this.state;
    const feedTypes = {
      0: 'syndicated',
      1: 'podcast',
      2: 'sitemap',
    };
    return feedTypes[selectedViewIndex];
  }

  getFeeds = (isActive) => {
    const { feeds } = this.props;
    const sortedFeeds = feeds.sort((a, b) => b.lastNewStoryMoment - a.lastNewStoryMoment);
    const filteredFeedTypes = sortedFeeds.filter(f => f.type === this.getSelectedFeedType());
    return isActive === undefined ? filteredFeedTypes : filteredFeedTypes.filter(f => f.active === isActive);
  }

  render() {
    const { sourceId, sourceName, feeds, scrapeFeeds, pushToUrl, user } = this.props;
    const { formatMessage } = this.props.intl;
    if (feeds === undefined) {
      return (
        <div />
      );
    }
    const tabLabels = [
      formatMessage(localMessages.rssFeeds),
      formatMessage(localMessages.podcasts),
    ];
    // TODO: ungated this feature once sitemaps functionality is released
    if (hasPermissions(getUserRoles(user), PERMISSION_MEDIA_EDIT)) {
      tabLabels.push(formatMessage(localMessages.sitemaps));
    }
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <PageTitle value={[localMessages.pageTitle, sourceName]} />
        </Grid>
        <Grid item xs={9}>
          <h1>
            <MediaSourceIcon height={32} />
            <Link to={`/sources/${sourceId}`}>
              <FormattedMessage {...localMessages.sourceFeedsTitle} values={{ name: sourceName }} />
            </Link>
          </h1>
        </Grid>
        <Grid item xs={3}>
          <div className="actions" style={{ marginTop: 40 }}>
            <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
          </div>
        </Grid>
        <Grid item xs={12}>
          <TabSelector
            tabLabels={tabLabels}
            onViewSelected={index => this.setState({ selectedViewIndex: index })}
          />
        </Grid>
        {this.getSelectedFeedType() === 'sitemap' && (
          <Grid item xs={12}>
            <SourceSitemapsContainer sourceId={sourceId} feeds={this.getFeeds()} />
          </Grid>
        )}
        {this.getSelectedFeedType() !== 'sitemap' && (
          <>
            <Permissioned onlyRole={PERMISSION_MEDIA_EDIT}>
              <Grid container item spacing={1}>
                { this.getSelectedFeedType() === 'syndicated' && (
                  <Grid item>
                    <AppButton
                      className="source-scrape-feeds-button"
                      label={formatMessage(messages.scrapeForFeeds)}
                      color="primary"
                      onClick={scrapeFeeds}
                    />
                  </Grid>
                )}
                <Grid item>
                  <AppButton
                    className="source-scrape-feeds-button"
                    label={formatMessage(localMessages.add)}
                    color="primary"
                    onClick={() => { pushToUrl(`/sources/${sourceId}/feeds/create`); }}
                  />
                </Grid>
              </Grid>
            </Permissioned>
            <Grid item xs={12}>
              <h2>{formatMessage(localMessages.activeLabel)}</h2>
              <SourceFeedTable feeds={this.getFeeds(true)} feedStatus="Active" />
            </Grid>
            <Grid item xs={12}>
              <h2>{formatMessage(localMessages.inactiveLabel)}</h2>
              <SourceFeedTable feeds={this.getFeeds(false)} feedStatus="Inactive" />
            </Grid>
          </>
        )}
      </Grid>
    );
  }
}

SourceFeedContainer.propTypes = {
  intl: PropTypes.object.isRequired,
  // from dispatch
  scrapeFeeds: PropTypes.func.isRequired,
  pushToUrl: PropTypes.func.isRequired,
  // from context
  params: PropTypes.object.isRequired, // params from router
  // from state
  fetchStatus: PropTypes.string.isRequired,
  sourceId: PropTypes.number.isRequired,
  sourceName: PropTypes.string.isRequired,
  feeds: PropTypes.array,
  feedcount: PropTypes.number,
  user: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  sourceId: parseInt(ownProps.params.sourceId, 10),
  sourceName: state.sources.sources.selected.sourceDetails.name,
  fetchStatus: state.sources.sources.selected.feed.feeds.fetchStatus,
  feeds: state.sources.sources.selected.feed.feeds.list,
  feedcount: state.sources.sources.selected.feed.feeds.count,
  user: state.user,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  pushToUrl: url => dispatch(push(url)),
  scrapeFeeds: () => {
    dispatch(scrapeSourceFeeds(ownProps.params.sourceId))
      .then((results) => {
        if ((results.job_state.state === SOURCE_SCRAPE_STATE_QUEUED)
          || (results.job_state.state === SOURCE_SCRAPE_STATE_RUNNING)) {
          dispatch(updateFeedback({ classes: 'info-notice', open: true, message: ownProps.intl.formatMessage(messages.sourceScraping) }));
          // update the source so the user sees the new scrape status
          dispatch(fetchSourceDetails(ownProps.params.sourceId))
            .then(() => dispatch(push(`/sources/${ownProps.params.sourceId}`)));
        } else {
          dispatch(updateFeedback({ classes: 'error-notice', open: true, message: ownProps.intl.formatMessage(messages.sourceScrapeFailed) }));
        }
      });
  },
});

const fetchAsyncData = (dispatch, { sourceId }) => dispatch(fetchSourceFeeds(sourceId));

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withAsyncData(fetchAsyncData, ['sourceId'])(
      SourceFeedContainer
    )
  )
);
