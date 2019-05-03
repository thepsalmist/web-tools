import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { selectMediaPickerQueryArgs, fetchMediaPickerSources } from '../../../../actions/systemActions';
import { FETCH_ONGOING } from '../../../../lib/fetchConstants';
import SourceResultsTable from './SourceResultsTable';
import AdvancedMediaPickerSearchForm from '../AdvancedMediaPickerSearchForm';
import LoadingSpinner from '../../LoadingSpinner';
import { ALL_MEDIA } from '../../../../lib/mediaUtil';

const localMessages = {
  title: { id: 'system.mediaPicker.sources.title', defaultMessage: 'Sources matching "{name}"' },
  hintText: { id: 'system.mediaPicker.sources.hint', defaultMessage: 'Search sources by name or url' },
  noResults: { id: 'system.mediaPicker.sources.noResults', defaultMessage: 'No results. Try searching for the name or URL of a specific source to see if we cover it, like Washington Post, Hindustan Times, or guardian.co.uk.' },
  showAdvancedOptions: { id: 'system.mediaPicker.sources.showAdvancedOptions', defaultMessage: 'Show Advanced Options' },
  hideAdvancedOptions: { id: 'system.mediaPicker.sources.hideAdvancedOptions', defaultMessage: 'Hide Advanced Options' },
  allMedia: { id: 'system.mediaPicker.sources.allMedia', defaultMessage: 'All Media (not advised)' },
};

const formSelector = formValueSelector('advanced-media-picker-search');

class SourceSearchResultsContainer extends React.Component {
  processQuery = (values) => {
    const { formQuery, selectedMediaQueryType } = this.props;
    const updatedQueryObj = Object.assign({}, values, { type: selectedMediaQueryType });

    const formValues = formQuery !== null && formQuery !== undefined ? formQuery : [];
    // this may not work if we have not updated the form via submit...
    updatedQueryObj.tags = []; // TODO check that we are not overwriting previous values
    const metadataQueryFields = ['publicationCountry', 'publicationState', 'primaryLanguage', 'countryOfFocus'];

    // TODO there are multiple choices here that we need to iterate through
    metadataQueryFields.forEach((key) => {
      updatedQueryObj.tags[key] = [];
      if (formValues && key in formValues) { // if in form, I don't think we are overwrited, except most recent updates are not there usually
        updatedQueryObj.tags[key].push(formValues[key]);
      }
    });
    updatedQueryObj.tags.mediaType = [];

    // mediaType handles multiple choice first. others to follow suite
    Object.values(values).forEach((obj) => {
      if (obj !== undefined && (obj.selected === true || obj.value === true)) {
        updatedQueryObj.tags.mediaType.push(obj);
      }
    });

    if (typeof values === 'object' && 'allMedia' in values) {
      updatedQueryObj.tags.push(values.allMedia);
    }
    return updatedQueryObj;
  }

  updateQuerySelection = (metadataType, values) => {
    const { updateMediaQuerySelection } = this.props;
    const updatedQueryObj = this.processQuery(values);

    updateMediaQuerySelection(updatedQueryObj);
  }

  updateAndSearchWithSelection = (values) => {
    const { handleUpdateAndSearchWithSelection } = this.props;
    const updatedQueryObj = this.processQuery(values);
    handleUpdateAndSearchWithSelection(updatedQueryObj);
  }

  render() {
    const { fetchStatus, selectedMediaQueryKeyword, sourceResults, onToggleSelected, selectedMediaQueryArgs } = this.props;
    const { formatMessage } = this.props.intl;
    let content = null;
    let resultContent = null;
    content = (
      <div>
        <AdvancedMediaPickerSearchForm
          initValues={{ storedKeyword: { mediaKeyword: selectedMediaQueryKeyword }, tags: selectedMediaQueryArgs }}
          onMetadataSelection={(metadataType, values) => this.updateQuerySelection(metadataType, values)}
          onSearch={val => this.updateAndSearchWithSelection(val)}
          hintText={formatMessage(localMessages.hintText)}
        />
      </div>
    );

    if (fetchStatus === FETCH_ONGOING) {
      resultContent = <LoadingSpinner />;
    } else if (sourceResults && (sourceResults.list && (sourceResults.list.length > 0 || (sourceResults.args && sourceResults.args.media_keyword)))) {
      resultContent = (
        <SourceResultsTable
          title={formatMessage(localMessages.title, { name: selectedMediaQueryKeyword })}
          sources={sourceResults.list}
          onToggleSelected={onToggleSelected}
        />
      );
    } else {
      resultContent = <FormattedMessage {...localMessages.noResults} />;
    }
    return (
      <div>
        {content}
        {resultContent}
      </div>
    );
  }
}

SourceSearchResultsContainer.propTypes = {
  intl: PropTypes.object.isRequired,
  // from parent
  onToggleSelected: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string,
  selectedMediaQueryType: PropTypes.number,
  selectedMediaQueryKeyword: PropTypes.string,
  selectedMediaQueryArgs: PropTypes.object,
  sourceResults: PropTypes.object,
  formQuery: PropTypes.object,
  mediaQuery: PropTypes.array,
  selectedMetadata: PropTypes.object,
  // from dispatch
  updateMediaQuerySelection: PropTypes.func.isRequired,
  // updateAdvancedMediaQuerySelection: PropTypes.func.isRequired,
  handleUpdateAndSearchWithSelection: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.system.mediaPicker.sourceQueryResults.fetchStatus,
  selectedMediaQueryType: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.type : 0,
  selectedMediaQueryKeyword: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.mediaKeyword : null,
  selectedMediaQueryArgs: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args : null,
  sourceResults: state.system.mediaPicker.sourceQueryResults,
  formQuery: formSelector(
    state,
    'publicationCountry',
    'publicationState',
    'primaryLanguage',
    'countryOfFocus',
    'mediaType',
    'allMedia',
  ),
  mediaQuery: formSelector(
    state,
    'mediaType',
  ),
  selectedMetadata: state.system.metadata.selected,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  /* updateMediaQuerySelection: (values) => {
    if (values && notEmptyString(values.mediaKeyword)) {
      dispatch(selectMediaPickerQueryArgs(values));
      dispatch(fetchMediaPickerSources({ media_keyword: values.mediaKeyword }));
    }
  }, */
  updateMediaQuerySelection: (values) => {
    if (values && values.tags && Object.values(values.tags).length > 0) {
      if (values.allMedia) { // handle the "all media" placeholder selection
        ownProps.onToggleSelected({ id: ALL_MEDIA, label: ownProps.intl.formatMessage(localMessages.allMedia) });
      } else {
        dispatch(selectMediaPickerQueryArgs({ type: values.type, ...values.tags }));
      }
    }
  },
  handleUpdateAndSearchWithSelection: (values) => {
    if (values.mediaKeyword || values.tags) {
      if (values.allMedia) { // handle the "all media" placeholder selection
        ownProps.onToggleSelected({ id: ALL_MEDIA, label: ownProps.intl.formatMessage(localMessages.allMedia) });
      } else {
        dispatch(selectMediaPickerQueryArgs(values));
        const tags = Object.values(values.tags).filter(t => t.length > 0).reduce((a, b) => a.concat(b), []).map(i => i.tags_id)
          .join(',');
        dispatch(fetchMediaPickerSources({ media_keyword: values.mediaKeyword || '*', tags }));
      }
    }
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    SourceSearchResultsContainer
  )
);
