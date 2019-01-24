import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { fetchSystemSourceSearch, resetSystemSourceSearch } from '../../actions/systemActions';
import { AsyncAutocomplete } from './form/Autocomplete';

const MAX_SUGGESTIONS = 10;

const localMessages = {
  searchHint: { id: 'sources.search.hint', defaultMessage: 'Search for sources' },
};

const SimpleSourceSearchContainer = props => (
  <AsyncAutocomplete
    placeholder={props.intl.formatMessage(localMessages.searchHint)}
    onLoadOptions={props.handleSearch}
    onSelected={item => props.onMediaSourceSelected(item.value)}
  />
);

SimpleSourceSearchContainer.propTypes = {
  intl: PropTypes.object.isRequired,
  // from parent
  onMediaSourceSelected: PropTypes.func,
  // from dispatch
  handleSearch: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({
  // fetchOngoing: (state.system.sourceSearch.fetchStatus === FETCH_ONGOING),
  // sourceResults: state.system.sourceSearch.list,
});

const mapDispatchToProps = dispatch => ({
  handleSearch: (searchString, callback) => {
    if (searchString && (searchString.length > 0)) {
      dispatch(fetchSystemSourceSearch(searchString))
        .then((results) => {
          const options = results.list.map(m => ({ value: m.media_id, label: m.name })).slice(0, MAX_SUGGESTIONS);
          callback(options);
        });
    } else {
      dispatch(resetSystemSourceSearch());
    }
  },
});

SimpleSourceSearchContainer.propTypes = {
  // from context
  intl: PropTypes.object.isRequired,
};


export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    SimpleSourceSearchContainer
  )
);
