import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import MediaTable from '../MediaTable';
import { fetchTopicInfluentialMedia, sortTopicInfluentialMedia } from '../../../actions/topicActions';
import { DownloadButton } from '../../common/IconButton';
import MediaSearchContainer from './MediaSearchContainer';
import messages from '../../../resources/messages';
import DataCard from '../../common/DataCard';
import withFilteredAsyncData from '../FilteredAsyncDataContainer';
import { pagedAndSortedLocation, filtersAsUrlParams } from '../../util/location';
import withPaging from '../../common/hocs/PagedContainer';
import MediaSourceIcon from '../../common/icons/MediaSourceIcon';
import TopicPageTitle from '../TopicPageTitle';

const localMessages = {
  title: { id: 'topic.influentialMedia.title', defaultMessage: 'Influential Media' },
};

const InfluentialMediaContainer = (props) => {
  const { media, sort, handleChangeSort, topicId, previousButton, nextButton, filters } = props;
  const { formatMessage } = props.intl;
  return (
    <Grid>
      <Row>
        <Col lg={12}>
          <TopicPageTitle value={localMessages.title} />
          <MediaSearchContainer topicId={topicId} showSearch />
          <DataCard border={false}>
            <div className="actions">
              <DownloadButton
                tooltip={formatMessage(messages.download)}
                onClick={() => {
                  const url = `/api/topics/${topicId}/media.csv?${filtersAsUrlParams(filters)}&sort=${sort}`;
                  window.location = url;
                }}
              />
            </div>
            <h1>
              <MediaSourceIcon height={32} />
              <FormattedMessage {...localMessages.title} />
            </h1>
            <MediaTable
              media={media}
              topicId={topicId}
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

InfluentialMediaContainer.ROWS_PER_PAGE = 50;

InfluentialMediaContainer.propTypes = {
  // from store
  fetchStatus: PropTypes.string.isRequired,
  sort: PropTypes.string.isRequired,
  media: PropTypes.array.isRequired,
  links: PropTypes.object,
  topicId: PropTypes.number.isRequired,
  topicInfo: PropTypes.object.isRequired,
  // from dispatch
  handleChangeSort: PropTypes.func.isRequired,
  // from compositional chain
  intl: PropTypes.object.isRequired,
  nextButton: PropTypes.node,
  previousButton: PropTypes.node,
  filters: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.media.fetchStatus,
  sort: state.topics.selected.media.sort,
  media: state.topics.selected.media.media,
  links: state.topics.selected.media.link_ids,
  topicId: state.topics.selected.id,
  topicInfo: state.topics.selected.info,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleChangeSort: (sort) => {
    dispatch(push(pagedAndSortedLocation(ownProps.location, null, sort)));
    dispatch(sortTopicInfluentialMedia(sort));
  },
});

const fetchAsyncData = (dispatch, props) => {
  const params = {
    ...props.filters,
    sort: props.sort,
    limit: InfluentialMediaContainer.ROWS_PER_PAGE,
    linkId: props.location.query.linkId,
  };
  dispatch(fetchTopicInfluentialMedia(props.topicId, params));
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
    withPaging(handlePageChange)(
      withFilteredAsyncData(fetchAsyncData, ['sort', 'linkId'])(
        InfluentialMediaContainer
      )
    )
  )
);
