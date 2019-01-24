import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { AsyncAutocomplete } from '../../common/form/Autocomplete';
import { fetchTopicSearchResults } from '../../../actions/topicActions';

const localMessages = {
  placeholder: { id: 'topic.search.placeholder', defaultMessage: 'Search by name' },
  seeAll: { id: 'topic.search.placeholder', defaultMessage: '(see more results)' },
};

const TopicQuickSearchContainer = props => (
  <AsyncAutocomplete
    placeholder={props.intl.formatMessage(localMessages.placeholder)}
    onLoadOptions={props.handleSearch}
    onSelected={props.handleTopicSelected}
  />
);

TopicQuickSearchContainer.propTypes = {
  // from context
  intl: PropTypes.object.isRequired,
  // from dispatch
  handleTopicSelected: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleTopicSelected: (item) => {
    if (item.value === -1) {
      dispatch(push(`/topics/search?name=${item.searchString}`));
    } else {
      dispatch(push(`/topics/${item.value}/summary`));
    }
  },
  handleSearch: (searchString, callback) => {
    if (searchString) {
      dispatch(fetchTopicSearchResults(searchString))
        .then((results) => {
          const options = results.topics.map(t => ({ value: t.topics_id, label: t.name })).slice(0, 5);
          options.push({ searchString, value: -1, label: ownProps.intl.formatMessage(localMessages.seeAll) });
          callback(options);
        });
    }
  },
});

export default
injectIntl(
  connect(null, mapDispatchToProps)(
    TopicQuickSearchContainer
  )
);
