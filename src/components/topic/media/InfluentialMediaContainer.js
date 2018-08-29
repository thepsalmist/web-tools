import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import MediaTable from '../MediaTable';
import { fetchTopicInfluentialMedia, sortTopicInfluentialMedia } from '../../../actions/topicActions';
import { DownloadButton } from '../../common/IconButton';
import TopicSourceSearchContainer from '../search/TopicSourceSearchContainer';
import messages from '../../../resources/messages';
import DataCard from '../../common/DataCard';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import { pagedAndSortedLocation } from '../../util/location';
import withPaging from '../../common/hocs/PagedContainer';
import MediaSourceIcon from '../../common/icons/MediaSourceIcon';

const localMessages = {
  title: { id: 'topic.influentialMedia.title', defaultMessage: 'Influential Media' },
};

class InfluentialMediaContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { fetchData, filters, sort, links } = this.props;
    // can't compare filters the object here because it changes on load
    if ((nextProps.filters.timespanId !== filters.timespanId) || (nextProps.filters.q !== filters.q) ||
      (nextProps.sort !== sort) || (nextProps.links.current !== links.current)) {
      fetchData(nextProps);
    }
  }
  onChangeSort = (newSort) => {
    const { sortData } = this.props;
    sortData(newSort);
  }
  downloadCsv = () => {
    const { topicId, filters, sort } = this.props;
    const url = `/api/topics/${topicId}/media.csv?snapshotId=${filters.snapshotId}&timespanId=${filters.timespanId}&sort=${sort}`;
    window.location = url;
  }
  render() {
    const { media, sort, topicId, previousButton, nextButton } = this.props;
    const { formatMessage } = this.props.intl;
    const titleHandler = parentTitle => `${formatMessage(localMessages.title)} | ${parentTitle}`;
    return (
      <Grid>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Helmet><title>{titleHandler()}</title></Helmet>
            <TopicSourceSearchContainer showSearch />
            <DataCard border={false}>
              <div className="actions">
                <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
              </div>
              <h1>
                <MediaSourceIcon height={32} />
                <FormattedMessage {...localMessages.title} />
              </h1>
              <MediaTable media={media} topicId={topicId} onChangeSort={this.onChangeSort} sortedBy={sort} />
              { previousButton }
              { nextButton }
            </DataCard>
          </Col>
        </Row>
      </Grid>
    );
  }
}

InfluentialMediaContainer.ROWS_PER_PAGE = 50;

InfluentialMediaContainer.propTypes = {
  fetchStatus: PropTypes.string.isRequired,
  sort: PropTypes.string.isRequired,
  media: PropTypes.array.isRequired,
  topicId: PropTypes.number.isRequired,
  topicInfo: PropTypes.object.isRequired,
  fetchData: PropTypes.func.isRequired,
  sortData: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  links: PropTypes.object,
  // from PagedContainer wrapper
  nextButton: PropTypes.node,
  previousButton: PropTypes.node,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.media.fetchStatus,
  sort: state.topics.selected.media.sort,
  media: state.topics.selected.media.media,
  links: state.topics.selected.media.link_ids,
  filters: state.topics.selected.filters,
  topicId: state.topics.selected.id,
  topicInfo: state.topics.selected.info,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (props, linkId) => {
    const params = {
      ...props.filters,
      sort: props.sort,
      limit: InfluentialMediaContainer.ROWS_PER_PAGE,
      linkId,
    };
    dispatch(fetchTopicInfluentialMedia(props.topicId, params))
      .then((results) => {
        dispatch(push(pagedAndSortedLocation(
          ownProps.location,
          results.link_ids.current,
          props.sort,
          props.filters,
        )));
      });
  },
  sortData: (sort) => {
    dispatch(push(pagedAndSortedLocation(ownProps.location, null, sort)));
    dispatch(sortTopicInfluentialMedia(sort));
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
      withPaging(
        withAsyncFetch(
          InfluentialMediaContainer
        )
      )
    )
  );
