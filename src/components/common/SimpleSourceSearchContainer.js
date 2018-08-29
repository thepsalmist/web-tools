import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import AutoComplete from 'material-ui/AutoComplete';
import LoadingSpinner from './LoadingSpinner';
import { SearchButton } from './IconButton';
import { FETCH_ONGOING } from '../../lib/fetchConstants';
import { urlToTopicMapper } from '../../lib/urlUtil';
import { fetchSystemSourceSearch, resetSystemSourceSearch } from '../../actions/systemActions';

const MAX_SUGGESTION_CHARS = 70;
const DEFAULT_MAX_SOURCES_TO_SHOW = 5;
const DELAY_BEFORE_SEARCH_MS = 500; // wait this long after a keypress to fire a search


const localMessages = {
  searchHint: { id: 'sources.search.hint', defaultMessage: 'Search for sources' },
};

class SourceSearchContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lastSearchString: '',
      lastKeypress: 0,
      searchTimeout: null,
    };
  }

  getMaxSourcesToShow = () => {
    const { maxSources } = this.props;
    return maxSources || DEFAULT_MAX_SOURCES_TO_SHOW;
  }

  handleClick = (menuItem) => {
    const topicIdDummy = '2113';
    if (menuItem.item) { // TODO: handle url generically
      window.location = urlToTopicMapper(`/topics/${topicIdDummy}/media/${menuItem.item.media_id}/`);
    }
    // something like const topicMediaUrl = filteredLinkTo(`/topics/${topics_id}/media`, filters);
    // dispatch(push(topicSummaryUrl));
    // annoyingly need to timeout to reset the field after selection is made (so it fires after menuCloseDelay)
    // @see https://stackoverflow.com/questions/34387787/how-to-clear-the-text-in-a-material-ui-auto-complete-field
    setTimeout(() => {
      this.setState({ lastSearchString: '' });
    }, 300);
  }

  fireSearchIfNeeded = () => {
    const { search } = this.props;
    const shouldSearch = this.state.lastSearchString.length > 3;
    if (shouldSearch) {
      search(this.state.lastSearchString);
    }
  }

  handleMenuItemKeyDown = (item, event) => {
    switch (event.key) {
      case 'Enter':
        this.handleClick(item); // should we treat the enter as a trigger to search or a trigger to take them to that media entry?
        break;
      default: break;
    }
  }

  resetIfRequested = () => {
    const { sourceResults } = this.props;
    const results = sourceResults.slice(0, this.getMaxSourcesToShow());
    const resultsAsComponents = results.map((item) => {
      const menuItemValue = (
        <MenuItem
          onClick={() => this.handleClick(item)}
          onKeyDown={this.handleMenuItemKeyDown.bind(this, item)}
          id={`searchResult${item.media_id || item.tags_id}`}
        >
          <ListItemText>{(item.name.length > MAX_SUGGESTION_CHARS) ? `${item.name.substr(0, MAX_SUGGESTION_CHARS)}...` : item.name}</ListItemText>
        </MenuItem>
      );
      return ({
        text: item.name,
        value: menuItemValue,
        item,
      });
    });

    return resultsAsComponents;
  }

  handleUpdateInput = (searchString) => {
    clearTimeout(this.state.searchTimeout); // cancel any pending searches
    this.setState({
      lastSearchString: searchString,
      searchTimeout: setTimeout(this.fireSearchIfNeeded, DELAY_BEFORE_SEARCH_MS),  // schedule a search for when they stop typing
    });
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

  render() {
    const { fetchOngoing } = this.props;
    const { formatMessage } = this.props.intl;
    const resultsAsComponents = this.resetIfRequested();
    const fetchingStatus = (fetchOngoing) ? <LoadingSpinner size={15} /> : null;
    return (
      <div className="async-search source-search">
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
          maxSearchResults={this.getMaxSourcesToShow()}
          filter={() => true}
        />
      </div>
    );
  }

}

SourceSearchContainer.propTypes = {
  intl: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  // from parent
  searchSources: PropTypes.bool,      // include source results?
  onMediaSourceSelected: PropTypes.func,
  fetchOngoing: PropTypes.string,
  maxSources: PropTypes.number,
  sourceResults: PropTypes.array.isRequired,
  // from dispatch
  search: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchOngoing: (state.system.sourceSearch.fetchStatus === FETCH_ONGOING),
  sourceResults: state.system.sourceSearch.list,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  search: (searchString) => {
    // TODO: add support for filtering out static collections, based on `searchStaticCollections` flag
    // handle the situation where you are searching for just collections and NOT sources
    const searchSources = (ownProps.searchSources === undefined) || (ownProps.searchSources === true);
    if (!searchSources) {
      dispatch(resetSystemSourceSearch());
    } else {
      dispatch(fetchSystemSourceSearch(searchString));
    }
  },
});

SourceSearchContainer.propTypes = {
  // from context
  intl: PropTypes.object.isRequired,
};


export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      SourceSearchContainer
    )
  );
