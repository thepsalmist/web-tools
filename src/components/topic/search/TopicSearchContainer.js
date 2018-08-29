import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from '@material-ui/core/MenuItem';
import { fetchTopicSearchResults } from '../../../actions/topicActions';
import LoadingSpinner from '../../common/LoadingSpinner';
import { SearchButton } from '../../common/IconButton';
import { FETCH_ONGOING } from '../../../lib/fetchConstants';

const MAX_SUGGESTION_CHARS = 60;
const DEFAULT_MAX_TOPICS_TO_SHOW = 5;

const DELAY_BEFORE_SEARCH_MS = 500; // wait this long after a keypress to fire a search

const localMessages = {
  searchHint: { id: 'topics.search.hint', defaultMessage: 'Search by topic name' },
};

class TopicSearchContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lastSearchString: '',
      lastKeypress: 0,
      searchTimeout: null,
    };
  }

  getMaxTopicsToShow = () => {
    const { maxTopics } = this.props;
    return maxTopics || DEFAULT_MAX_TOPICS_TO_SHOW;
  }

  handleClick = (item) => {
    const { onTopicSelected } = this.props;
    if (item) {
      onTopicSelected(item.item);
    }
  }

  fireSearchIfNeeded = () => {
    const { search } = this.props;
    const shouldSearch = this.state.lastSearchString.length > 3;
    if (shouldSearch) {
      search(this.state.lastSearchString);
    }
  }

  handleUpdateInput = (searchString) => {
    clearTimeout(this.state.searchTimeout); // cancel any pending searches
    this.setState({
      lastSearchString: searchString,
      searchTimeout: setTimeout(this.fireSearchIfNeeded, DELAY_BEFORE_SEARCH_MS),  // schedule a search for when they stop typing
    });
  }

  handleMenuItemKeyDown = (item, event) => {
    switch (event.key) {
      case 'Enter':
        this.handleClick(item);
        break;
      default: break;
    }
  }

  handleNewRequest = (item, index) => {
    const { search } = this.props;
    if (index === -1) { // they pressed enter in the text field
      search(item.text);
      return;
    }
    // we want to send the user to the topic media url. The handleClick is no longer triggered in new/old material-ui setup
    this.handleClick(item);
  }

  resetIfRequested = () => {
    const { topicResults } = this.props;
    let results = [];
    results = results.concat(topicResults);
    const resultsAsComponents = results.map(item => ({
      text: item.name,
      value: (
        <MenuItem
          onClick={() => this.handleClick(item)}
          onKeyDown={this.handleMenuItemKeyDown.bind(this, item)}
          primaryText={(item.name.length > MAX_SUGGESTION_CHARS) ? `${item.name.substr(0, MAX_SUGGESTION_CHARS)}...` : item.name}
        />
      ),
      item,
    }));
    return resultsAsComponents;
  }

  render() {
    const { fetchStatus } = this.props;
    const { formatMessage } = this.props.intl;
    const resultsAsComponents = this.resetIfRequested();
    const isFetching = fetchStatus === FETCH_ONGOING;
    const fetchingStatus = (isFetching) ? <LoadingSpinner size={15} /> : null;
    return (
      <div className="async-search topic-search right">
        <SearchButton />
        <div className="fetching">{fetchingStatus}</div>
        <AutoComplete
          label={formatMessage(localMessages.searchHint)}
          fullWidth
          openOnFocus
          searchText={this.state.lastSearchString}
          onClick={this.resetIfRequested}
          dataSource={resultsAsComponents}
          onUpdateInput={this.handleUpdateInput}
          onNewRequest={this.handleNewRequest}
          maxSearchResults={this.getMaxTopicsToShow()}
          filter={() => true}
        />
      </div>
    );
  }
}

TopicSearchContainer.propTypes = {
  // from context
  intl: PropTypes.object.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  topicResults: PropTypes.array.isRequired,
  maxTopics: PropTypes.number,
  // from dispatch
  onTopicSelected: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.search.fetchStatus,
  topicResults: state.topics.search.topics,
});

const mapDispatchToProps = dispatch => ({
  onTopicSelected: (item) => {
    dispatch(push(`/topics/${item.id}/summary`));
  },
  search: (searchString) => {
    dispatch(fetchTopicSearchResults(searchString));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      TopicSearchContainer
    )
  );
