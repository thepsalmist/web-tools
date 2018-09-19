import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { selectMedia, toggleMedia, selectMediaPickerQueryArgs, resetMediaPickerQueryArgs, resetMediaPickerSources, resetMediaPickerCollections } from '../../../actions/systemActions';
import { PICK_COLLECTION, PICK_SOURCE, PICK_COUNTRY, PICK_FEATURED } from '../../../lib/explorerUtil';
import * as fetchConstants from '../../../lib/fetchConstants';
import CountryCollectionSearchResultsContainer from './results/CountryCollectionSearchResultsContainer';
import AllCollectionSearchResultsContainer from './results/AllCollectionSearchResultsContainer';
import SourceSearchResultsContainer from './results/SourceSearchResultsContainer';
import FeaturedFavoriteSearchResultsContainer from './results/FeaturedFavoriteSearchResultsContainer';
import { TAG_SET_ABYZ_GEO_COLLECTIONS, VALID_COLLECTION_IDS } from '../../../lib/tagUtil';

class MediaPickerResultsContainer extends React.Component {
  componentWillMount() {
    this.correlateSelection(this.props);
  }

  componentWillReceiveProps(nextProps) {
    // const { handleMediaConcurrency } = this.props;
    if (nextProps.selectedMediaQueryType !== this.props.selectedMediaQueryType) {
      this.updateMediaQuery({ type: nextProps.selectedMediaQueryType });
    }
    if (nextProps.selectedMedia !== this.props.selectedMedia
      // if the results have changed from a keyword entry, we need to update the UI
      || (nextProps.sourceResults && nextProps.sourceResults.lastFetchSuccess !== this.props.sourceResults.lastFetchSuccess)) {
      this.correlateSelection(nextProps);
    }
  }

  componentWillUnmount() {
    const { resetComponents } = this.props;
    resetComponents();
  }

  correlateSelection(whichProps) {
    let whichList = {};

    switch (whichProps.selectedMediaQueryType) {
      case PICK_COUNTRY:
        whichList = whichProps.collectionResults;
        break;
      case PICK_COLLECTION:
        whichList = whichProps.collectionResults;
        break;
      case PICK_SOURCE:
        whichList = whichProps.sourceResults;
        break;
      default:
        break;
    }
    // if selected media has changed, update current results
    if (whichProps.selectedMedia && whichProps.selectedMedia.length > 0
      // we can't be sure we have received results yet
      && whichList.list && whichList.list.length > 0) {
      // sync up selectedMedia and push to result sets.
      whichList.list.map((m) => {
        const mediaIndex = whichProps.selectedMedia.findIndex(q => q.id === m.id);
        if (mediaIndex < 0) {
          this.props.toggleConcurrency(m, false);
        } else if (mediaIndex >= 0) {
          this.props.toggleConcurrency(m, true);
        }
        return m;
      });
    }
    return 0;
  }

  updateMediaQuery(values) {
    const { updateMediaQuerySelection } = this.props;
    updateMediaQuerySelection(values);
  }

  handleToggleAndSelectMedia(media) {
    const { handleToggleAndSelectMedia } = this.props;
    handleToggleAndSelectMedia(media);
  }

  render() {
    const { selectedMediaQueryType, toggleConcurrency, handleToggleAndSelectMedia } = this.props;
    let content = null;
    const whichMedia = {};
    whichMedia.fetchStatus = null;
    switch (selectedMediaQueryType) {
      case PICK_COUNTRY:
        content = (
          <CountryCollectionSearchResultsContainer
            whichTagSet={TAG_SET_ABYZ_GEO_COLLECTIONS}
            handleMediaConcurrency={toggleConcurrency}
            handleToggleAndSelectMedia={handleToggleAndSelectMedia}
          />
        );
        break;
      case PICK_COLLECTION:
        content = (
          <AllCollectionSearchResultsContainer
            whichTagSet={VALID_COLLECTION_IDS}
            handleMediaConcurrency={toggleConcurrency}
            handleToggleAndSelectMedia={handleToggleAndSelectMedia}
          />
        );
        break;
      case PICK_SOURCE:
        content = <SourceSearchResultsContainer handleMediaConcurrency={toggleConcurrency} handleToggleAndSelectMedia={handleToggleAndSelectMedia} />;
        break;
      case PICK_FEATURED:
        content = (
          <FeaturedFavoriteSearchResultsContainer
            whichTagSet={VALID_COLLECTION_IDS}
            handleMediaConcurrency={toggleConcurrency}
            handleToggleAndSelectMedia={handleToggleAndSelectMedia}
          />
        );
        break;
      default:
        break;
    }
    return (
      <div className="select-media-container">
        {content}
      </div>
    );
  }
}

MediaPickerResultsContainer.propTypes = {
  intl: PropTypes.object.isRequired,
  toggleConcurrency: PropTypes.func.isRequired,
  handleToggleAndSelectMedia: PropTypes.func.isRequired,
  updateMediaQuerySelection: PropTypes.func.isRequired,
  selectedMediaQueryType: PropTypes.number,
  resetComponents: PropTypes.func.isRequired,
  featured: PropTypes.object,
  favoritedCollections: PropTypes.object,
  favoritedSources: PropTypes.object,
  collectionResults: PropTypes.object,
  sourceResults: PropTypes.object,
  selectedMedia: PropTypes.array,
};

const mapStateToProps = state => ({
  fetchStatus: (state.system.mediaPicker.sourceQueryResults.fetchStatus === fetchConstants.FETCH_SUCCEEDED || state.system.mediaPicker.collectionQueryResults.fetchStatus === fetchConstants.FETCH_SUCCEEDED || state.system.mediaPicker.favoritedCollections.fetchStatus === fetchConstants.FETCH_SUCCEEDED) ? fetchConstants.FETCH_SUCCEEDED : fetchConstants.FETCH_INVALID,
  selectedMedia: state.system.mediaPicker.selectMedia.list,
  selectedMediaQueryType: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.type : 0,
  timestamp: state.system.mediaPicker.featured ? state.system.mediaPicker.featured.timestamp : null,
  collectionResults: state.system.mediaPicker.collectionQueryResults,
  featured: state.system.mediaPicker.featured ? state.system.mediaPicker.featured : null,
  sourceResults: state.system.mediaPicker.sourceQueryResults,
  favoritedCollections: state.system.mediaPicker.favoritedCollections ? state.system.mediaPicker.favoritedCollections : null,
  favoritedSources: state.system.mediaPicker.favoritedSources ? state.system.mediaPicker.favoritedSources : null,
});

const mapDispatchToProps = dispatch => ({
  updateMediaQuerySelection: (values) => {
    if (values) {
      dispatch(selectMediaPickerQueryArgs(values));
    }
  },
  toggleConcurrency: (selectedMedia, onOrOff) => {
    if (selectedMedia) {
      dispatch(toggleMedia({ selectedMedia, setSelected: onOrOff })); // for search results selectedMedia >> results
    }
  },
  handleToggleAndSelectMedia: (selectedMedia) => {
    if (selectedMedia) {
      // dispatch(toggleMedia(selectedMedia));
      dispatch(selectMedia(selectedMedia)); // disable button too
    }
  },
  resetComponents: () => {
    dispatch(resetMediaPickerQueryArgs());
    dispatch(resetMediaPickerSources());
    dispatch(resetMediaPickerCollections());
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    MediaPickerResultsContainer
  )
);
