import PropTypes from 'prop-types';
import React from 'react';
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
import withFilteredAsyncData from '../FilteredAsyncDataContainer';
import withCsvDownloadNotifyContainer from '../../common/hocs/CsvDownloadNotifyContainer';
import withHelp from '../../common/hocs/HelpfulContainer';
import { pagedAndSortedLocation } from '../../util/location';
import withPaging from '../../common/hocs/PagedContainer';
import { HELP_STORIES_CSV_COLUMNS } from '../../../lib/helpConstants';
import TopicPageTitle from '../TopicPageTitle';

const localMessages = {
  title: { id: 'topic.influentialStories.title', defaultMessage: 'Influential Stories' },
  exploreLink: { id: 'topic.influentialStories.exploreLink', defaultMessage: 'Try the experimental dynamic story explorer UI.' },
};

const InfluentialStoriesContainer = (props) => {
  const { stories, filters, showTweetCounts, sort, topicId, previousButton, nextButton, helpButton,
    handleChangeSort, notifyOfCsvDownload } = props;
  const { formatMessage } = props.intl;
  return (
    <Grid>
      <Row>
        <Col lg={12}>
          <TopicPageTitle value={localMessages.title} />
          <DataCard border={false}>
            <div className="actions">
              <DownloadButton
                tooltip={formatMessage(messages.download)}
                onClick={() => {
                  const url = `/api/topics/${topicId}/stories.csv?snapshotId=${filters.snapshotId}&timespanId=${filters.timespanId}&sort=${sort}`;
                  window.location = url;
                  notifyOfCsvDownload(HELP_STORIES_CSV_COLUMNS);
                }}
              />
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
            <TopicStoryTable
              topicId={topicId}
              stories={stories}
              showTweetCounts={showTweetCounts}
              onChangeSort={newSort => handleChangeSort(newSort)}
              sortedBy={sort}
            />
            { previousButton }
            { nextButton }
          </DataCard>
        </Col>
      </Row>
    </Grid>
  );
};

InfluentialStoriesContainer.ROWS_PER_PAGE = 50;

InfluentialStoriesContainer.propTypes = {
  // from the composition chain
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
  notifyOfCsvDownload: PropTypes.func,
  filters: PropTypes.object.isRequired,
  // from parent
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  handleChangeSort: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  sort: PropTypes.string.isRequired,
  stories: PropTypes.array.isRequired,
  topicInfo: PropTypes.object.isRequired,
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
  topicInfo: state.topics.selected.info,
  showTweetCounts: Boolean(state.topics.selected.info.ch_monitor_id),
  topicId: state.topics.selected.id,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  sortData: (sort) => {
    dispatch(push(pagedAndSortedLocation(ownProps.location, null, sort)));
    dispatch(sortTopicInfluentialStories(sort));
  },
});

const fetchAsyncData = (dispatch, props) => {
  const params = {
    ...props.filters,
    sort: props.sort,
    limit: InfluentialStoriesContainer.ROWS_PER_PAGE,
    linkId: props.location.query.linkId,
  };
  dispatch(fetchTopicInfluentialStories(props.topicId, params));
};

const handlePageChange = (dispatch, props, linkId) => {
  // just update the URL - the FilteredAsyncData HOC will detect this and call fetchAsyncData for you
  dispatch(push(pagedAndSortedLocation(
    props.location,
    linkId,
    props.sort,
    props.filters,
  )));
};

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withHelp(messages.storiesTableHelpTitle, messages.storiesTableHelpText)(
      withCsvDownloadNotifyContainer(
        withPaging(handlePageChange)(
          withFilteredAsyncData(fetchAsyncData, ['sort', 'linkId'])(
            InfluentialStoriesContainer
          )
        )
      )
    )
  )
);
