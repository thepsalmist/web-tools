import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncFetch from '../../hocs/AsyncContainer';
import { fetchMediaPickerFeaturedCollections } from '../../../../actions/systemActions';
import CollectionResultsTable from './CollectionResultsTable';
import * as fetchConstants from '../../../../lib/fetchConstants';
import TAG_SET_MC_ID from '../../../../lib/tagUtil';
import LoadingSpinner from '../../LoadingSpinner';

const localMessages = {
  title: { id: 'system.mediaPicker.select.featured.title', defaultMessage: 'Featured Collections' },
};

const FeaturedCollectionsContainer = (props) => {
  const { fetchStatus, collections, handleToggleAndSelectMedia } = props;
  const { formatMessage } = props.intl;
  if (fetchStatus !== fetchConstants.FETCH_SUCCEEDED) {
    return <LoadingSpinner />;
  }
  return (
    <CollectionResultsTable
      title={formatMessage(localMessages.title)}
      collections={collections}
      handleToggleAndSelectMedia={handleToggleAndSelectMedia}
    />
  );
};

FeaturedCollectionsContainer.propTypes = {
  intl: PropTypes.object.isRequired,
  fetchStatus: PropTypes.string,
  collections: PropTypes.array,
  handleToggleAndSelectMedia: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.system.mediaPicker.featured.fetchStatus,
  collections: state.system.mediaPicker.featured ? state.system.mediaPicker.featured.list : null,
});

const mapDispatchToProps = dispatch => ({
  asyncFetch: () => {
    dispatch(fetchMediaPickerFeaturedCollections(TAG_SET_MC_ID));
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withAsyncFetch(
      FeaturedCollectionsContainer
    )
  )
);
