import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchTopicEntitiesOrgs, filterByQuery } from '../../../actions/topicActions';
import DataCard from '../../common/DataCard';
import EntitiesTable from '../../common/EntitiesTable';
import { filtersAsUrlParams, filteredLocation } from '../../util/location';
import { DownloadButton } from '../../common/IconButton';
import messages from '../../../resources/messages';
// import { generateParamStr } from '../../../lib/apiUtil';

const localMessages = {
  title: { id: 'topic.snapshot.topStories.coverage.title', defaultMessage: 'Top Organizations' },
};

class TopOrgsContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { filters, fetchData } = this.props;
    if (nextProps.filters !== filters) {
      fetchData(nextProps.topicId, nextProps.filters);
    }
  }
  downloadCsv = () => {
    const { topicId, filters } = this.props;
    const url = `/api/topics/${topicId}/entities/organizations/entities.csv?${filtersAsUrlParams(filters)}`;
    window.location = url;
  }
  handleEntityClick = (tagId) => {
    const { filters, updateQueryFilter } = this.props;
    const queryFragment = `tags_id_stories: ${tagId}`;
    if (filters.q && filters.q.length > 0) {
      updateQueryFilter(`(${filters.q}) AND (${queryFragment})`);
    } else {
      updateQueryFilter(queryFragment);
    }
  }
  render() {
    const { count, entities } = this.props;
    const { formatMessage } = this.props.intl;
    let content = null;
    if (count !== null) {
      content = <EntitiesTable entities={entities} onClick={(...args) => this.handleEntityClick(args)} />;
    }
    return (
      <DataCard>
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <h2>
          <FormattedMessage {...localMessages.title} />
        </h2>
        {content}
      </DataCard>
    );
  }
}

TopOrgsContainer.propTypes = {
  // from compositional chain
  location: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  filters: PropTypes.object.isRequired,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  // from state
  count: PropTypes.number,
  entities: PropTypes.array.isRequired,
  total: PropTypes.number,
  fetchStatus: PropTypes.string.isRequired,
  updateQueryFilter: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.summary.topEntitiesOrgs.fetchStatus,
  count: state.topics.selected.summary.topEntitiesOrgs.counts.count,
  total: state.topics.selected.summary.topEntitiesOrgs.counts.total,
  entities: state.topics.selected.summary.topEntitiesOrgs.entities,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (topicId, filters) => {
    dispatch(fetchTopicEntitiesOrgs(topicId, filters));
  },
  updateQueryFilter: (newQueryFilter) => {
    const newFilters = {
      ...ownProps.filters,
      q: newQueryFilter,
    };
    const newLocation = filteredLocation(ownProps.location, newFilters);
    dispatch(push(newLocation));
    dispatch(filterByQuery(newQueryFilter));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.topicId, ownProps.filters);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeAsyncContainer(
        TopOrgsContainer
      )
    )
  );