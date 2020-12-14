import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { resetMediaPickerCollections } from '../../../../actions/systemActions';
import CollectionSearchResultsContainer from './CollectionSearchResultsContainer';

const localMessages = {
  title: { id: 'system.mediaPicker.collections.title', defaultMessage: 'Collections matching "{name}"' },
  countrySearchHintText: { id: 'system.mediaPicker.collections.countryHint', defaultMessage: 'Search curated collections of country & state sources' },
  noResults: { id: 'system.mediaPicker.collections.noResults', defaultMessage: 'No results. Try searching for issues like online news, health, blogs, conservative to see if we have collections made up of those types of sources.' },
};

class CountryCollectionSearchResultsContainer extends React.Component {
  componentDidMount() {
    const { clearPreviousCollections } = this.props;
    clearPreviousCollections();
  }

  render() {
    const { selectedMediaQueryType, selectedMediaQueryKeyword, onToggleSelected, fetchStatus, viewOnly, geoCollectionsSet } = this.props;
    return (
      <CollectionSearchResultsContainer
        fetchStatus={fetchStatus}
        whichTagSet={[geoCollectionsSet]}
        onToggleSelected={onToggleSelected}
        selectedMediaQueryType={selectedMediaQueryType}
        selectedMediaQueryKeyword={selectedMediaQueryKeyword}
        initValues={{ mediaKeyword: selectedMediaQueryKeyword }}
        hintTextMsg={localMessages.countrySearchHintText}
        handleMediaConcurrency={this.props.handleMediaConcurrency}
        viewOnly={viewOnly}
      />
    );
  }
}

CountryCollectionSearchResultsContainer.propTypes = {
  // form compositional chain
  intl: PropTypes.object.isRequired,
  // from parent
  onToggleSelected: PropTypes.func.isRequired,
  handleMediaConcurrency: PropTypes.func.isRequired,
  // from dispatch
  clearPreviousCollections: PropTypes.func.isRequired,
  // from state
  selectedMediaQueryKeyword: PropTypes.string,
  selectedMediaQueryType: PropTypes.number,
  collectionResults: PropTypes.object,
  fetchStatus: PropTypes.string,
  viewOnly: PropTypes.bool,
  geoCollectionsSet: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.system.mediaPicker.collectionQueryResults.fetchStatus,
  selectedMediaQueryType: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.type : 0,
  selectedMediaQueryKeyword: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.mediaKeyword : null,
  collectionResults: state.system.mediaPicker.collectionQueryResults,
  geoCollectionsSet: state.system.staticTags.tagSets.geoCollectionsSet,
});

const mapDispatchToProps = (dispatch) => ({
  clearPreviousCollections: () => dispatch(resetMediaPickerCollections()), // clear prev results
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    CountryCollectionSearchResultsContainer
  )
);
