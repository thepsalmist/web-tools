import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncFetch from './hocs/AsyncContainer';
import { fetchTopEntitiesOrgs } from '../../actions/systemActions';
import DataCard from './DataCard';
import EntitiesTable from './EntitiesTable';
import { DownloadButton } from './IconButton';
import messages from '../../resources/messages';

const localMessages = {
  title: { id: 'entities.topStories.coverage.title', defaultMessage: 'Top Organizations' },
};

class TopOrgsContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { queries, fetchData } = this.props;
    if (nextProps.queries !== queries) {
      fetchData(nextProps.queries);
    }
  }

  handleEntityClick = (tagId) => {
    const { queries, updateQueryFilter } = this.props;
    const queryFragment = `tags_id_stories: ${tagId}`;
    if (queries.q && queries.q.length > 0) {
      updateQueryFilter(`(${queries.q}) AND (${queryFragment})`);
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
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  // from state
  count: PropTypes.number,
  queries: PropTypes.array.isRequired,
  entities: PropTypes.array.isRequired,
  total: PropTypes.number,
  fetchStatus: PropTypes.string.isRequired,
  updateQueryFilter: PropTypes.func.isRequired,
  downloadCsv: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.system.topEntitiesOrgs.fetchStatus,
  count: state.system.topEntitiesOrgs.counts.count,
  total: state.system.topEntitiesOrgs.counts.total,
  entities: state.system.topEntitiesOrgs.entities,
});

const mapDispatchToProps = dispatch => ({
  fetchData: (queryParams) => {
    dispatch(fetchTopEntitiesOrgs(queryParams));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.queries);
    },
  });
}

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    withAsyncFetch(
      TopOrgsContainer
    )
  )
);
