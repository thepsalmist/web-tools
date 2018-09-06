import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import QueryPickerLoadUserSearchesDialog from './QueryPickerLoadUserSearchesDialog';
import QueryPickerSaveUserSearchesDialog from './QueryPickerSaveUserSearchesDialog';


const SavedSearchControls = (props) => {
  const { handleLoadSearches, handleLoadSelectedSearch, handleSaveSearch, handleDeleteSearch, savedSearches, searchNickname, submitting, setQueryFormChildDialogOpen } = props;
  return (
    <div className="saved-search-controls-wrapper">
      <QueryPickerLoadUserSearchesDialog
        handleLoadSearches={handleLoadSearches}
        handleDeleteSearch={handleDeleteSearch}
        handleLoadSelectedSearch={handleLoadSelectedSearch}
        searches={savedSearches}
        submitting={submitting}
        setQueryFormChildDialogOpen={setQueryFormChildDialogOpen}
      />
      <QueryPickerSaveUserSearchesDialog
        handleSaveSearch={handleSaveSearch}
        searchNickname={searchNickname}
        submitting={submitting}
        setQueryFormChildDialogOpen={setQueryFormChildDialogOpen}
      />
    </div>
  );
};

SavedSearchControls.propTypes = {
  // from parent
  submitting: PropTypes.bool,
  updateQuery: PropTypes.func,
  handleSubmit: PropTypes.func,
  pristine: PropTypes.bool,
  setQueryFormChildDialogOpen: PropTypes.func.isRequired,
  searchNickname: PropTypes.string.isRequired,
  savedSearches: PropTypes.array,
  handleSaveSearch: PropTypes.func.isRequired,
  handleLoadSearches: PropTypes.func.isRequired,
  handleLoadSelectedSearch: PropTypes.func.isRequired,
  handleDeleteSearch: PropTypes.func.isRequired,
  // from composition
  intl: PropTypes.object.isRequired,
};


export default injectIntl(SavedSearchControls);
