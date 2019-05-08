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
  componentWillMount() {
    this.correlateSelection(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedMedia !== this.props.selectedMedia
      // if the results have changed from a keyword entry, we need to update the UI
      || (nextProps.sourceResults && nextProps.sourceResults.lastFetchSuccess !== this.props.sourceResults.lastFetchSuccess)) {
      this.correlateSelection(nextProps);
    }
  }

  processQuery = (values) => {
    const { selectedMediaQueryType, selectedMediaQueryTags } = this.props;
    // essentially reselect all values that are currently selected, plus the newly clicked/entered ones
    // TODO: redundant assignment w values since we add them below?
    const updatedQueryObj = Object.assign({}, { type: selectedMediaQueryType, tags: selectedMediaQueryTags }, values);

    if (updatedQueryObj.tags === undefined) {
      updatedQueryObj.tags = []; // if first metadata selection
    }

    const metadataQueryFields = ['publicationCountry', 'publicationState', 'primaryLanguage', 'countryOfFocus', 'mediaType'];

    metadataQueryFields.forEach((key) => {
      if (updatedQueryObj.tags[key] === undefined) {
        updatedQueryObj.tags[key] = [];
      }
      Object.values(values).forEach((obj) => {
        if (obj !== undefined
          && values.name === key) {
          const modifiedObjIndex = updatedQueryObj.tags[key].findIndex(o => obj.tags_id === o.tags_id);
          if (modifiedObjIndex > -1) {
            updatedQueryObj.tags[key][modifiedObjIndex].value = obj.value; // update
            updatedQueryObj.tags[key][modifiedObjIndex].selected = obj.value; // update
          } else if (obj.tags_id) {
            updatedQueryObj.tags[key].push(obj); // or insert ? Or do in reducer?
          }
        }
      });
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

  correlateSelection(whichProps) {
    const whichList = whichProps.sourceResults.list;

    // if selected media has changed, update current results
    if (whichProps.selectedMedia && whichProps.selectedMedia.length > 0
      // we can't be sure we have received results yet
      && whichList && whichList.length > 0) {
      // sync up selectedMedia and push to result sets.
      whichList.map((m) => {
        const mediaIndex = whichProps.selectedMedia.findIndex(q => q.id === m.id);
        if (mediaIndex < 0) {
          this.props.handleMediaConcurrency(m, false);
        } else if (mediaIndex >= 0) {
          this.props.handleMediaConcurrency(m, true);
        }
        return m;
      });
    }
    return 0;
  }

  render() {
    const { fetchStatus, selectedMediaQueryKeyword, sourceResults, onToggleSelected, selectedMediaQueryTags } = this.props;
    const { formatMessage } = this.props.intl;
    let content = null;
    let resultContent = null;
    content = (
      <div>
        <AdvancedMediaPickerSearchForm
          initValues={{ storedKeyword: { mediaKeyword: selectedMediaQueryKeyword }, tags: selectedMediaQueryTags }}
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
  handleMediaConcurrency: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string,
  selectedMedia: PropTypes.array,
  selectedMediaQueryType: PropTypes.number,
  selectedMediaQueryKeyword: PropTypes.string,
  selectedMediaQueryTags: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  sourceResults: PropTypes.object,
  formQuery: PropTypes.object,
  mediaQuery: PropTypes.array,
  // from dispatch
  updateMediaQuerySelection: PropTypes.func.isRequired,
  // updateAdvancedMediaQuerySelection: PropTypes.func.isRequired,
  handleUpdateAndSearchWithSelection: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.system.mediaPicker.sourceQueryResults.fetchStatus,
  selectedMedia: state.system.mediaPicker.selectMedia.list,
  selectedMediaQueryType: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.type : 0,
  selectedMediaQueryKeyword: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.mediaKeyword : null,
  selectedMediaQueryTags: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.tags : null,
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
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateMediaQuerySelection: (values) => {
    if (values && values.tags && Object.values(values.tags).length > 0) {
      if (values.allMedia) { // handle the "all media" placeholder selection
        ownProps.onToggleSelected({ id: ALL_MEDIA, label: ownProps.intl.formatMessage(localMessages.allMedia) });
      } else {
        dispatch(selectMediaPickerQueryArgs({ type: values.type, tags: { ...values.tags } }));
      }
    }
  },
  handleUpdateAndSearchWithSelection: (values) => {
    if (values.mediaKeyword || values.tags) {
      if (values.allMedia) { // handle the "all media" placeholder selection
        ownProps.onToggleSelected({ id: ALL_MEDIA, label: ownProps.intl.formatMessage(localMessages.allMedia) });
      } else {
        dispatch(selectMediaPickerQueryArgs(values));
        let tags = Object.values(values.tags).filter(t => t.length > 0);
        const selectedTags = [];
        tags.forEach((t) => {
          selectedTags.push(t.filter(m => m.value).reduce((a, b) => a.concat(b), []).map(i => i.tags_id));
        });
        tags = selectedTags.join(',');
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
