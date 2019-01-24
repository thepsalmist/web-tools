import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { AsyncAutocomplete } from '../../common/form/Autocomplete';
import { fetchSourceSearch, fetchCollectionSearch, resetSourceSearch, resetCollectionSearch } from '../../../actions/sourceActions';

const DEFAULT_MAX_SOURCES_TO_SHOW = 5;
const DEFAULT_MAX_COLLECTIONS_TO_SHOW = 3;

const ADVANCED_SEARCH_ITEM_VALUE = -1;

const localMessages = {
  advancedSearch: { id: 'sources.search.advanced', defaultMessage: 'Advanced Search...' },
  combinedSearchHint: { id: 'sources.search.hint.combined', defaultMessage: 'Search for media sources or collections' },
  sourceSearchHint: { id: 'sources.search.hint.source', defaultMessage: 'Search for media sources' },
  collectionSearchHint: { id: 'sources.search.hint.collection', defaultMessage: 'Search for collections' },
};

const placeholderText = ({ onMediaSourceSelected, onCollectionSelected, intl }) => {
  let msg;
  if (onMediaSourceSelected && onCollectionSelected) {
    msg = localMessages.combinedSearchHint;
  } else if (onMediaSourceSelected) {
    msg = localMessages.sourceSearchHint;
  } else if (onCollectionSelected) {
    msg = localMessages.collectionSearchHint;
  }
  if (msg) {
    return intl.formatMessage(msg);
  }
  return null;
};

const SourceSearchContainer = props => (
  <AsyncAutocomplete
    placeholder={placeholderText(props)}
    onLoadOptions={props.handleSearch}
    onSelected={(item) => {
      if (item.type === 'source') {
        props.onMediaSourceSelected(item);
      } else if (item.type === 'collection') {
        props.onCollectionSelected(item);
      } else if (item.type === 'advanced') {
        props.onAdvancedSearchSelected(item.searchString);
      }
    }}
  />
);

SourceSearchContainer.propTypes = {
  intl: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  // from parent
  disableStaticCollections: PropTypes.bool,
  onMediaSourceSelected: PropTypes.func,
  onCollectionSelected: PropTypes.func,
  onAdvancedSearchSelected: PropTypes.func,
  maxSources: PropTypes.number,
  maxCollections: PropTypes.number,
  // from dispatch
  handleSearch: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({
});

const sourceOrCollectionLabel = (item) => {
  if (item.tags_id) {
    // it is a collection
    const tagSetName = item.tag_set_label;
    const collectionName = item.label || item.tag;
    return `${tagSetName}: ${collectionName}`;
  }
  // it is a media source
  return item.name;
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSearch: (searchString, callback) => {
    const sourceLimit = ownProps.maxSources || DEFAULT_MAX_SOURCES_TO_SHOW;
    const collectionLimit = ownProps.maxCollections || DEFAULT_MAX_COLLECTIONS_TO_SHOW;
    // turn the results into a list of items
    const suggestionsFromResults = (results) => {
      let toShow = results;
      if (ownProps.disableStaticCollections) {
        toShow = toShow.filter(item => item.media_id || (item.is_static === false));
      }
      const options = toShow.map(item => ({
        ...item, // need to pass all these details for the parent to use when selected
        value: item.tags_id || item.media_id,
        label: sourceOrCollectionLabel(item),
        type: (item.tags_id) ? 'collection' : 'source',
      }));
      if (ownProps.onAdvancedSearchSelected) {
        options.push({
          value: ADVANCED_SEARCH_ITEM_VALUE,
          label: ownProps.intl.formatMessage(localMessages.advancedSearch),
          type: 'advanced',
          searchString,
        });
      }
      callback(options);
    };
    // now figure out which searches to run
    if (searchString && (searchString.length > 0)) {
      if (ownProps.onMediaSourceSelected && ownProps.onCollectionSelected) {
        Promise.all([
          dispatch(fetchSourceSearch(searchString)),
          dispatch(fetchCollectionSearch(searchString)),
        ]).then(results => suggestionsFromResults(
          results[0].list.slice(0, sourceLimit).concat(results[1].list.slice(0, collectionLimit))
        ));
      } else if (ownProps.onMediaSourceSelected) {
        dispatch(resetSourceSearch());
        dispatch(fetchSourceSearch(searchString))
          .then(results => suggestionsFromResults(results.list.slice(0, sourceLimit)));
      } else if (ownProps.onCollectionSelected) {
        dispatch(resetCollectionSearch());
        dispatch(fetchCollectionSearch(searchString))
          .then(results => suggestionsFromResults(results.list.slice(0, collectionLimit)));
      }
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
