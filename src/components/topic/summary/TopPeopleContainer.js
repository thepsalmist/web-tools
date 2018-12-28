import PropTypes from 'prop-types';
import React from 'react';
import { FormattedHTMLMessage, FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ActionMenu from '../../common/ActionMenu';
import withFilteredAsyncData from '../FilteredAsyncDataContainer';
import { fetchTopicEntitiesPeople, filterByQuery } from '../../../actions/topicActions';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_LOGGED_IN } from '../../../lib/auth';
import withSummary from '../../common/hocs/SummarizedVizualization';
import EntitiesTable from '../../common/EntitiesTable';
import { filtersAsUrlParams, filteredLocation } from '../../util/location';
import { DownloadButton } from '../../common/IconButton';
import messages from '../../../resources/messages';

const COVERAGE_REQUIRED = 0.7;
const NUMBER_TO_SHOW = 10;

const localMessages = {
  title: { id: 'topic.snapshot.topPeople.title', defaultMessage: `Top ${NUMBER_TO_SHOW} People` },
  notEnoughData: { id: 'topic.snapshot.topPeople.notEnoughData',
    defaultMessage: '<i>Sorry, but only {pct} of the stories have been processed to add the people they mention.  We can\'t gaurantee the accuracy of partial results, so we don\'t show a table of results here.  If you are really curious, you can download the CSV using the link in the top-right of this box, but don\'t trust those numbers as fully accurate. Email us if you want us to process this topic to add the people mentioned.</i>',
  },
  downloadCSV: { id: 'topic.snapshot.topPeople.downloadCSV', defaultMessage: `Download Top ${NUMBER_TO_SHOW} People CSV` },
};

class TopPeopleContainer extends React.Component {
  downloadCsv = () => {
    const { topicId, filters } = this.props;
    const url = `/api/topics/${topicId}/entities/people/entities.csv?${filtersAsUrlParams(filters)}`;
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
    const { coverage, entities } = this.props;
    const { formatNumber } = this.props.intl;
    let content = null;
    const coverageRatio = coverage.count / coverage.total;
    if (coverageRatio > COVERAGE_REQUIRED) {
      content = <EntitiesTable entities={entities.slice(0, NUMBER_TO_SHOW)} onClick={(...args) => this.handleEntityClick(args)} />;
    } else {
      content = (
        <p>
          <FormattedHTMLMessage
            {...localMessages.notEnoughData}
            values={{
              pct: formatNumber(coverageRatio, { style: 'percent', maximumFractionDigits: 2 }),
            }}
          />
        </p>
      );
    }
    return (
      <React.Fragment>
        {content}
        <Permissioned onlyRole={PERMISSION_LOGGED_IN}>
          <div className="actions">
            <ActionMenu actionTextMsg={messages.downloadOptions}>
              <MenuItem
                className="action-icon-menu-item"
                onClick={this.downloadCsv}
              >
                <ListItemText><FormattedMessage {...localMessages.downloadCSV} /></ListItemText>
                <ListItemIcon><DownloadButton /></ListItemIcon>
              </MenuItem>
            </ActionMenu>
          </div>
        </Permissioned>
      </React.Fragment>
    );
  }
}

TopPeopleContainer.propTypes = {
  // from compositional chain
  location: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  filters: PropTypes.object.isRequired,
  // from state
  coverage: PropTypes.object.isRequired,
  entities: PropTypes.array.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  updateQueryFilter: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.summary.topEntitiesPeople.fetchStatus,
  coverage: state.topics.selected.summary.topEntitiesPeople.coverage,
  entities: state.topics.selected.summary.topEntitiesPeople.entities,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
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

const fetchAsyncData = (dispatch, props) => dispatch(fetchTopicEntitiesPeople(props.topicId, props.filters));

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withSummary(localMessages.title, messages.entityHelpContent)(
      withFilteredAsyncData(
        TopPeopleContainer,
        fetchAsyncData
      )
    )
  )
);
