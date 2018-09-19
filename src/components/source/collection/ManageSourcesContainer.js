import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Link from 'react-router/lib/Link';
import { FormattedMessage, FormattedNumber, injectIntl, FormattedDate } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import { fetchCollectionSourceList, scrapeSourceFeeds } from '../../../actions/sourceActions';
import AppButton from '../../common/AppButton';
import messages from '../../../resources/messages';
import Permissioned from '../../common/Permissioned';
import TabSelector from '../../common/TabSelector';
import { PERMISSION_MEDIA_EDIT } from '../../../lib/auth';
import { updateFeedback } from '../../../actions/appActions';
import { SOURCE_SCRAPE_STATE_QUEUED, SOURCE_SCRAPE_STATE_RUNNING, SOURCE_SCRAPE_STATE_COMPLETED, SOURCE_SCRAPE_STATE_ERROR } from '../../../reducers/sources/sources/selected/sourceDetails';
import FilledStarIcon from '../../common/icons/FilledStarIcon';
import { googleFavIconUrl } from '../../../lib/urlUtil';
import { parseSolrShortDate, jobStatusDateToMoment } from '../../../lib/dateUtil';

const REVIEW = 0;
const REMOVE = 1;
const UNSCRAPEABLE = 2;
const WORKING = 3;
const ALL = 4;

const localMessages = {
  title: { id: 'collection.manageSources.title', defaultMessage: 'Review Sources' },
  scrape: { id: 'collection.manageSources.scrape', defaultMessage: 'Scrape' }, // using this so we have a smaller button
  scrapeAll: { id: 'collection.manageSources.scrapeAll', defaultMessage: 'Scrape all For New Feeds' },
  inLast90Days: { id: 'collection.manageSources.column.last90', defaultMessage: '90 Day Story Count' },
  startedScrapingAll: { id: 'collection.manageSources.startedScrapingAll', defaultMessage: 'Started scraping all sources for RSS feeds' },
  lastScrapeQueuedSince: { id: 'source.basicInfo.feed.lastScrapeQueuedSince', defaultMessage: 'Scrape queued since {date}' },
  lastScrapeRunningSince: { id: 'source.basicInfo.feed.lastScrapeRunningSince', defaultMessage: 'Scrape running since {date}' },
  lastScrapeWorkedOn: { id: 'source.basicInfo.feed.lastScrapeWorkedOn', defaultMessage: 'Last scrape worked on {date}' },
  lastScrapeFailedOn: { id: 'source.basicInfo.feed.lastScrapeFailedOn', defaultMessage: 'Last scrape failed on {date}) ' },
  activeFeedCount: { id: 'collection.manageSources.column.activeFeedCount', defaultMessage: 'Active Feeds' },
  review: { id: 'collection.manageSources.tab.review', defaultMessage: 'Review' },
  reviewDesc: { id: 'collection.manageSources.tab.review.desc', defaultMessage: 'These sources have no feeds (scrape failed) or feeds with no stories (bad feeds). Click each URL to check if the website is still live (or parked with ads). If they are valid sites with news content, poke around the source code to look for any RSS feeds that might have been missed by the feed scraper.' },
  remove: { id: 'collection.manageSources.tab.remove', defaultMessage: 'Remove' },
  removeDesc: { id: 'collection.manageSources.tab.remove.desc', defaultMessage: 'These sources have no feeds and no recent stories, or trying to scrape them failed, and are candidates to remove from the collection. If the scrape job failed, that probably means the website is down (i.e. gone out of business or moved to a new URL). They will stay in Media Cloud, but won\'t be part of this collection.' },
  unscrapeable: { id: 'collection.manageSources.tab.unscrapeable', defaultMessage: 'Unscrapeable' },
  unscrapeableDesc: { id: 'collection.manageSources.tab.unscrapeable.desc', defaultMessage: 'These sources have content (that we have probably spidered), but we can\'t find any RSS feeds for them.' },
  working: { id: 'collection.manageSources.tab.working', defaultMessage: 'Working' },
  workingDesc: { id: 'collection.manageSources.tab.working.desc', defaultMessage: 'These are sources we think are working well and do not need to be checked' },
  all: { id: 'collection.manageSources.tab.all', defaultMessage: 'All' },
};

class ManageSourcesContainer extends React.Component {
  state = {
    scrapedAll: false,
    selectedViewIndex: 0,
  }

  componentWillReceiveProps(nextProps) {
    const { collectionId, fetchData } = this.props;
    if ((nextProps.collectionId !== collectionId)) {
      fetchData(nextProps.collectionId);
    }
  }

  onScrapeAll = () => {
    const { scrapeAllFeeds, sources } = this.props;
    scrapeAllFeeds(sources.map(s => s.media_id));
    this.setState({ scrapedAll: true });
  }

  render() {
    const { scrapeFeeds, sources } = this.props;
    const { formatMessage, formatDate } = this.props.intl;
    let viewSources = '';
    let viewDesc = '';
    switch (this.state.selectedViewIndex) {
      case REVIEW:
        viewSources = sources.filter(s => (s.active_feed_count === 0 && s.num_stories_90 === 0) || (s.active_feed_count > 0 && s.num_stories_90 === 0 && s.storiesInLastYear > 0));
        viewDesc = <FormattedMessage {...localMessages.reviewDesc} />;
        break;
      case REMOVE:
        viewSources = sources.filter(s => (s.active_feed_count > 0 && s.num_stories_90 === 0 && s.storiesInLastYear === 0) || (s.latest_scrape_job.state === 'failed'));
        viewDesc = <FormattedMessage {...localMessages.removeDesc} />;
        break;
      case UNSCRAPEABLE:
        viewSources = sources.filter(s => (s.active_feed_count === 0 && s.num_stories_90 > 0));
        viewDesc = <FormattedMessage {...localMessages.unscrapeableDesc} />;
        break;
      case WORKING:
        viewSources = sources.filter(s => (s.active_feed_count > 0 && s.storiesInLast90 > 0));
        viewDesc = <FormattedMessage {...localMessages.workingDesc} />;
        break;
      case ALL:
        viewSources = sources;
        break;
      default:
        break;
    }
    const tabContent = (
      <div>
        <Row>
          <TabSelector
            tabLabels={[
              formatMessage(localMessages.review),
              formatMessage(localMessages.remove),
              formatMessage(localMessages.unscrapeable),
              formatMessage(localMessages.working),
              formatMessage(localMessages.all),
            ]}
            onViewSelected={index => this.setState({ selectedViewIndex: index })}
          />
        </Row>
        <Row>
          <p>{viewDesc}</p>
        </Row>
      </div>
    );
    return (
      <Grid>
        <Row>
          <Col lg={8}>
            <h1><FormattedMessage {...localMessages.title} /></h1>
          </Col>
          <Col lg={4}>
            <Permissioned onlyRole={PERMISSION_MEDIA_EDIT}>
              <div className="action-buttons">
                <AppButton
                  color="primary"
                  className="source-scrape-feeds-button"
                  label={formatMessage(localMessages.scrapeAll)}
                  onClick={this.onScrapeAll}
                  disabled={this.state.scrapedAll}
                />
              </div>
            </Permissioned>
          </Col>
        </Row>
        { tabContent }
        <Row>
          <Col lg={12}>
            <br /><br />
            <div className="source-table">
              <table width="100%">
                <tbody>
                  <tr>
                    <th colSpan="2"><FormattedMessage {...messages.sourceName} /></th>
                    <th><FormattedMessage {...messages.sourceUrlProp} /></th>
                    <th className="numeric"><FormattedMessage {...messages.storiesPerDay} /></th>
                    <th className="numeric"><FormattedMessage {...messages.sourceStartDate} /></th>
                    <th className="numeric"><FormattedMessage {...localMessages.inLast90Days} /></th>
                    <th className="numeric"><FormattedMessage {...localMessages.activeFeedCount} /></th>
                    <th><FormattedMessage {...messages.sourceScrapeStatus} /></th>
                  </tr>
                  {viewSources.map((source, idx) => {
                    const scrapeButton = (
                      <AppButton
                        color="secondary"
                        variant="outlined"
                        className="source-scrape-feeds-button"
                        label={formatMessage(localMessages.scrape)}
                        onClick={() => scrapeFeeds(source.media_id)}
                      />
                    );
                    const removeButton = (
                      <AppButton
                        color="secondary"
                        variant="outlined"
                        className="source-remove-feeds-button"
                        label={formatMessage(localMessages.remove)}
                        onClick={() => scrapeFeeds(source.media_id)}
                      />
                    );
                    let removeContent;
                    if (this.state.selectedViewIndex === REMOVE) {
                      removeContent = removeButton;
                    }
                    let scrapeContent;
                    const lastScrapeUpdatedDate = source.latest_scrape_job ? formatDate(jobStatusDateToMoment(source.latest_scrape_job.last_updated)) : 'n/a';
                    if (source && source.latest_scrape_job && source.latest_scrape_job.state === SOURCE_SCRAPE_STATE_QUEUED) {
                      scrapeContent = (
                        <span>
                          <FormattedMessage {...localMessages.lastScrapeQueuedSince} values={{ date: lastScrapeUpdatedDate }} />
                        </span>
                      );
                    } else if (source && source.latest_scrape_job.state === SOURCE_SCRAPE_STATE_RUNNING) {
                      scrapeContent = (
                        <span>
                          <FormattedMessage {...localMessages.lastScrapeRunningSince} values={{ date: lastScrapeUpdatedDate }} />
                        </span>
                      );
                    } else if (source && source.latest_scrape_job.state === SOURCE_SCRAPE_STATE_COMPLETED) {
                      scrapeContent = (
                        <span>
                          {scrapeButton}
                          <br />
                          <FormattedMessage {...localMessages.lastScrapeWorkedOn} values={{ date: lastScrapeUpdatedDate }} />
                        </span>
                      );
                    } else if (source && source.latest_scrape_job.state === SOURCE_SCRAPE_STATE_ERROR) {
                      scrapeContent = (
                        <span>
                          {scrapeButton}
                          <br />
                          <FormattedMessage {...localMessages.lastScrapeFailedOn} values={{ date: lastScrapeUpdatedDate }} />
                        </span>
                      );
                    }
                    return (
                      <tr key={source.id ? source.id : source.media_id} className={(idx % 2 === 0) ? 'even' : 'odd'}>
                        <td>
                          <img className="google-icon" src={googleFavIconUrl(source.url)} alt={source.name} />
                        </td>
                        <td>
                          <Link to={`/sources/${source.id ? source.id : source.media_id}`}>{source.name}</Link>
                          { source.isFavorite ? <FilledStarIcon /> : '' }
                        </td>
                        <td><a href={source.url} rel="noopener noreferrer" target="_blank">{source.url}</a></td>
                        <td className="numeric"><FormattedNumber value={Math.round(source.num_stories_90)} /></td>
                        <td className="numeric"><FormattedDate value={parseSolrShortDate(source.start_date)} /></td>
                        <td className={`numeric ${Math.round(source.num_stories_90 * 90) === 0 ? 'error' : ''}`}>
                          <FormattedNumber value={Math.round(source.num_stories_90 * 90)} />
                        </td>
                        <td className={`numeric ${source.active_feed_count === 0 ? 'error' : ''}`}>
                          <FormattedNumber value={source.active_feed_count} />
                        </td>
                        <td>
                          <Permissioned onlyRole={PERMISSION_MEDIA_EDIT}>
                            {scrapeContent}
                            {removeContent}
                          </Permissioned>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

ManageSourcesContainer.propTypes = {
  intl: PropTypes.object.isRequired,
  // from store
  collectionId: PropTypes.number.isRequired,
  collection: PropTypes.object.isRequired,
  sources: PropTypes.array.isRequired,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  scrapeFeeds: PropTypes.func.isRequired,
  scrapeAllFeeds: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  collectionId: state.sources.collections.selected.id,
  collection: state.sources.collections.selected.collectionDetails.object,
  fetchStatus: state.sources.collections.selected.collectionSourceList.fetchStatus,
  sources: state.sources.collections.selected.collectionSourceList.sources,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (collectionId) => {
    dispatch(fetchCollectionSourceList(collectionId, { details: true }));
  },
  scrapeFeeds: (sourceId) => {
    dispatch(scrapeSourceFeeds(sourceId))
      .then((results) => {
        if ((results.job_state.state === SOURCE_SCRAPE_STATE_QUEUED)
          || (results.job_state.state === SOURCE_SCRAPE_STATE_RUNNING)) {
          dispatch(updateFeedback({ classes: 'info-notice', open: true, message: ownProps.intl.formatMessage(messages.sourceScraping) }));
          // update the page so the user sees the new scrape status
          window.location.reload();
        } else {
          dispatch(updateFeedback({ classes: 'error-notice', open: true, message: ownProps.intl.formatMessage(messages.sourceScrapeFailed) }));
        }
      });
  },
  scrapeAllFeeds: (mediaIdList) => {
    mediaIdList.forEach(mediaId => dispatch(scrapeSourceFeeds(mediaId)));
    dispatch(updateFeedback({ classes: 'info-notice', open: true, message: ownProps.intl.formatMessage(localMessages.startedScrapingAll) }));
  },
});


function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(stateProps.collectionId);
    },
  });
}

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    withAsyncFetch(
      ManageSourcesContainer
    )
  )
);
