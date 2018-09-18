import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import TopicStoryTable from '../TopicStoryTable';
import { fetchTopicInfluentialStories, sortTopicInfluentialStories } from '../../../actions/topicActions';
import messages from '../../../resources/messages';
import { DownloadButton } from '../../common/IconButton';
import DataCard from '../../common/DataCard';
import LinkWithFilters from '../LinkWithFilters';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import withCsvDownloadNotifyContainer from '../../common/hocs/CsvDownloadNotifyContainer';
import withHelp from '../../common/hocs/HelpfulContainer';
import { pagedAndSortedLocation } from '../../util/location';
import withPaging from '../../common/hocs/PagedContainer';
import { HELP_STORIES_CSV_COLUMNS } from '../../../lib/helpConstants';

const localMessages = {
  title: { id: 'topic.influentialStories.title', defaultMessage: 'Influential Stories' },
  exploreLink: { id: 'topic.influentialStories.exploreLink', defaultMessage: 'Try the experimental dynamic story explorer UI.' },
};

class InfluentialStoriesContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { fetchData, filters, sort, links } = this.props;
    if ((nextProps.filters !== filters) || (nextProps.sort !== sort) || (nextProps.links.current !== links.current)) {
      fetchData(nextProps);
    }
  }

  onChangeSort = (newSort) => {
    const { sortData } = this.props;
    sortData(newSort);
  }

  downloadCsv = () => {
    const { filters, sort, topicId, notifyOfCsvDownload } = this.props;
    const url = `/api/topics/${topicId}/stories.csv?snapshotId=${filters.snapshotId}&timespanId=${filters.timespanId}&sort=${sort}`;
    window.location = url;
    notifyOfCsvDownload(HELP_STORIES_CSV_COLUMNS);
  }

  render() {
    const { stories, showTweetCounts, sort, topicId, previousButton, nextButton, helpButton } = this.props;
    const { formatMessage } = this.props.intl;
    const titleHandler = parentTitle => `${formatMessage(localMessages.title)} | ${parentTitle}`;
    return (
      <Grid>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Helmet><title>{titleHandler()}</title></Helmet>
            <DataCard border={false}>
              <div className="actions">
                <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
              </div>
              <h2>
                <FormattedMessage {...localMessages.title} />
                {helpButton}
              </h2>
              <p>
                <LinkWithFilters to={`/topics/${topicId}/stories/explore`}>
                  <FormattedMessage {...localMessages.exploreLink} />
                </LinkWithFilters>
              </p>
              <TopicStoryTable topicId={topicId} stories={stories} showTweetCounts={showTweetCounts} onChangeSort={this.onChangeSort} sortedBy={sort} />
              { previousButton }
              { nextButton }
            </DataCard>
          </Col>
        </Row>
      </Grid>
    );
  }
}

InfluentialStoriesContainer.ROWS_PER_PAGE = 50;

InfluentialStoriesContainer.propTypes = {
  // from the composition chain
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
  notifyOfCsvDownload: PropTypes.func,
  // from parent
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  sortData: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  sort: PropTypes.string.isRequired,
  stories: PropTypes.array.isRequired,
  topicInfo: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  links: PropTypes.object,
  topicId: PropTypes.number.isRequired,
  showTweetCounts: PropTypes.bool,
  // from PagedContainer wrapper
  nextButton: PropTypes.node,
  previousButton: PropTypes.node,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.stories.fetchStatus,
  sort: state.topics.selected.stories.sort,
  stories: state.topics.selected.stories.stories,
  links: state.topics.selected.stories.link_ids,
  filters: state.topics.selected.filters,
  topicInfo: state.topics.selected.info,
  showTweetCounts: Boolean(state.topics.selected.info.ch_monitor_id),
  topicId: state.topics.selected.id,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (props, linkId) => {
    const params = {
      ...props.filters,
      sort: props.sort,
      limit: InfluentialStoriesContainer.ROWS_PER_PAGE,
      linkId,
    };
    dispatch(fetchTopicInfluentialStories(props.topicId, params))
      .then((results) => {
        // only update the url if it has changed
        if ((results.link_ids.current.toString() !== ownProps.location.query.linkId)
          || (props.sort !== ownProps.location.query.sort)) {
          dispatch(push(pagedAndSortedLocation(
            ownProps.location,
            results.link_ids.current,
            props.sort,
            props.filters
          )));
        }
      });
  },
  sortData: (sort) => {
    dispatch(push(pagedAndSortedLocation(ownProps.location, null, sort)));
    dispatch(sortTopicInfluentialStories(sort));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(stateProps);
    },
    nextPage: () => {
      dispatchProps.fetchData(stateProps, stateProps.links.next);
    },
    previousPage: () => {
      dispatchProps.fetchData(stateProps, stateProps.links.previous);
    },
  });
}

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    withHelp(messages.storiesTableHelpTitle, messages.storiesTableHelpText)(
      withPaging(
        withAsyncFetch(
          withCsvDownloadNotifyContainer(
            InfluentialStoriesContainer
          )
        )
      )
    )
  )
);
