import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { selectMediaPickerQueryArgs, fetchMediaPickerCountryCollections } from '../../../../actions/systemActions';
import CollectionSearchResultsContainer from './CollectionSearchResultsContainer';
import { notEmptyString } from '../../../../lib/formValidators';

const localMessages = {
  title: { id: 'system.mediaPicker.collections.title', defaultMessage: 'Collections matching "{name}"' },
  countrySearchHintText: { id: 'system.mediaPicker.collections.countryHint', defaultMessage: 'Search curated collections of country & state sources' },
  noResults: { id: 'system.mediaPicker.collections.noResults', defaultMessage: 'No results. Try searching for issues like online news, health, blogs, conservative to see if we have collections made up of those types of sources.' },
};


class CountryCollectionSearchResultsContainer extends React.Component {
  updateMediaQuery(values) {
    const { updateMediaQuerySelection, selectedMediaQueryType } = this.props;
    const updatedQueryObj = Object.assign({}, values, { type: selectedMediaQueryType });
    updateMediaQuerySelection(updatedQueryObj);
  }
  render() {
    const { selectedMediaQueryType, selectedMediaQueryKeyword, collectionResults, handleToggleAndSelectMedia, fetchCountryStatus } = this.props;
    return (
      <div>
        <CollectionSearchResultsContainer
          fetchStatus={fetchCountryStatus}
          handleToggleAndSelectMedia={handleToggleAndSelectMedia}
          selectedMediaQueryType={selectedMediaQueryType}
          selectedMediaQueryKeyword={selectedMediaQueryKeyword}
          collectionResults={collectionResults}
          initValues={{ storedKeyword: { mediaKeyword: selectedMediaQueryKeyword } }}
          onSearch={val => this.updateMediaQuery(val)}
          hintTextMsg={localMessages.countrySearchHintText}
        />
      </div>
    );
  }
}

CountryCollectionSearchResultsContainer.propTypes = {
  // form compositional chain
  intl: PropTypes.object.isRequired,
  // from parent
  handleToggleAndSelectMedia: PropTypes.func.isRequired,
  whichTagSet: PropTypes.number,
  // from dispatch
  updateMediaQuerySelection: PropTypes.func.isRequired,
  // from state
  selectedMediaQueryKeyword: PropTypes.string,
  selectedMediaQueryType: PropTypes.number,
  collectionResults: PropTypes.object,
  fetchCountryStatus: PropTypes.string,
};

const mapStateToProps = state => ({
  fetchCountryStatus: state.system.mediaPicker.countryCollectionQueryResults.fetchStatus,
  selectedMediaQueryType: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.type : 0,
  selectedMediaQueryKeyword: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.mediaKeyword : null,
  collectionResults: state.system.mediaPicker.countryCollectionQueryResults,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateMediaQuerySelection: (values) => {
    if (values && notEmptyString(values.mediaKeyword)) {
      dispatch(selectMediaPickerQueryArgs(values));
      dispatch(fetchMediaPickerCountryCollections({ media_keyword: values.mediaKeyword, which_set: ownProps.whichTagSet }));
    }
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      CountryCollectionSearchResultsContainer
    )
  );

