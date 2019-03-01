import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncData from '../../common/hocs/AsyncDataContainer';
import withCsvDownloadNotifyContainer from '../../common/hocs/CsvDownloadNotifyContainer';
import { fetchCollectionSourceList } from '../../../actions/sourceActions';
import SourceList from '../../common/SourceList';
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

const fetchAsyncData = (dispatch, { collectionId }) => dispatch(fetchCollectionSourceList(collectionId));

export default
injectIntl(
  connect(mapStateToProps)(
    withAsyncData(fetchAsyncData, ['collectionId'])(
      withCsvDownloadNotifyContainer(
        CollectionSourceListContainer
      )
    )
  )
);
