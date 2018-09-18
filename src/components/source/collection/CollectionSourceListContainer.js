import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import withCsvDownloadNotifyContainer from '../../common/hocs/CsvDownloadNotifyContainer';
import { fetchCollectionSourceList } from '../../../actions/sourceActions';
import SourceList from '../../common/SourceList';
import { getUserRoles, hasPermissions, PERMISSION_MEDIA_EDIT } from '../../../lib/auth';
import { HELP_SOURCES_CSV_COLUMNS } from '../../../lib/helpConstants';

const CollectionSourceListContainer = props => (
  <SourceList
    collectionId={props.collectionId}
    sources={props.sources}
    downloadUrl={`/api/collections/${props.collectionId}/sources.csv`}
    onDownload={() => props.notifyOfCsvDownload(HELP_SOURCES_CSV_COLUMNS)}
  />
);

CollectionSourceListContainer.propTypes = {
  // parent
  collectionId: PropTypes.number,
  downloadUrl: PropTypes.string,
  // from state
  sources: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  // from compositional chain
  notifyOfCsvDownload: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.collections.selected.collectionSourceList.fetchStatus,
  sources: state.sources.collections.selected.collectionSourceList.sources,
  user: state.user,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (collectionId, props) => {
    dispatch(fetchCollectionSourceList(ownProps.collectionId, props));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      const props = {};
      // if it is an admin user, fetch the source list with extra details so they are there for the manage sources screen
      if (hasPermissions(getUserRoles(stateProps.user), PERMISSION_MEDIA_EDIT)) {
        props.details = true;
      }
      dispatchProps.fetchData(ownProps.collectionId, props);
    },
  });
}

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    withAsyncFetch(
      withCsvDownloadNotifyContainer(
        CollectionSourceListContainer
      )
    )
  )
);
