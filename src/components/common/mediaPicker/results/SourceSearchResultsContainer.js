import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { selectMediaPickerQueryArgs, fetchMediaPickerSources } from '../../../../actions/systemActions';
import { FETCH_ONGOING } from '../../../../lib/fetchConstants';
import SourceResultsTable from './SourceResultsTable';
import AdvancedMediaPickerSearchForm from '../AdvancedMediaPickerSearchForm';
import MediaPickerSearchForm from '../MediaPickerSearchForm';
import LoadingSpinner from '../../LoadingSpinner';
import { notEmptyString } from '../../../../lib/formValidators';

const localMessages = {
  title: { id: 'system.mediaPicker.sources.title', defaultMessage: 'Sources matching "{name}"' },
  hintText: { id: 'system.mediaPicker.sources.hint', defaultMessage: 'Search sources by name or url' },
  noResults: { id: 'system.mediaPicker.sources.noResults', defaultMessage: 'No results. Try searching for the name or URL of a specific source to see if we cover it, like Washington Post, Hindustan Times, or guardian.co.uk.' },
  showAdvancedOptions: { id: 'system.mediaPicker.sources.showAdvancedOptions', defaultMessage: 'Show Advanced Options' },
  hideAdvancedOptions: { id: 'system.mediaPicker.sources.hideAdvancedOptions', defaultMessage: 'Hide Advanced Options' },
};

const formSelector = formValueSelector('advanced-media-picker-search');

class SourceSearchResultsContainer extends React.Component {
  state = {
    showAdvancedOptions: false,
  }

  toggleAdvancedOptions = () => {
    this.setState(prevState => ({ showAdvancedOptions: !prevState.showAdvancedOptions }));
  }

  updateMediaQuery(values) {
    const { formQuery, updateMediaQuerySelection, updateAdvancedMediaQuerySelection, selectedMediaQueryType } = this.props;
    const updatedQueryObj = Object.assign({}, values, { type: selectedMediaQueryType });

    if (this.state.showAdvancedOptions) {
      const formValues = formQuery['advanced-media-picker-search'];
      updatedQueryObj.tags = [];

      if ('publicationCountry' in formValues) {
        updatedQueryObj.tags.push(formValues.publicationCountry);
      }
      if ('publicationState' in formValues) {
        updatedQueryObj.tags.push(formValues.publicationState);
      }
      if ('primaryLanguage' in formValues) {
        updatedQueryObj.tags.push(formValues.primaryLanguage);
      }
      if ('countryOfFocus' in formValues) {
        updatedQueryObj.tags.push(formValues.countryOfFocus);
      }
      if ('mediaType' in formValues) {
        updatedQueryObj.tags.push(formValues.mediaType);
      }
      this.setState(updatedQueryObj);
      updateAdvancedMediaQuerySelection(updatedQueryObj);
    } else {
      updateMediaQuerySelection(updatedQueryObj);
    }
  }

  render() {
    const { fetchStatus, selectedMediaQueryKeyword, sourceResults, handleToggleAndSelectMedia } = this.props;
    const { formatMessage } = this.props.intl;
    let content = null;
    let resultContent = null;
    if (this.state.showAdvancedOptions) {
      content = (
        <div>
          <AdvancedMediaPickerSearchForm
            initValues={{ storedKeyword: { mediaKeyword: selectedMediaQueryKeyword } }}
            onSearch={val => this.updateMediaQuery(val)}
            hintText={formatMessage(localMessages.hintText)}
          />
          <a onTouchTap={this.toggleAdvancedOptions} className="media-picker-search-advanced"><FormattedMessage {...localMessages.hideAdvancedOptions} /></a>
        </div>
      );
    } else {
      content = (
        <div>
          <MediaPickerSearchForm
            initValues={{ storedKeyword: { mediaKeyword: selectedMediaQueryKeyword } }}
            onSearch={val => this.updateMediaQuery(val)}
            hintText={formatMessage(localMessages.hintText)}
          />
          <a onTouchTap={this.toggleAdvancedOptions} className="media-picker-search-advanced"><FormattedMessage {...localMessages.showAdvancedOptions} /></a>
        </div>
      );
    }
    if (fetchStatus === FETCH_ONGOING) {
      resultContent = <LoadingSpinner />;
    } else if (sourceResults && (sourceResults.list && (sourceResults.list.length > 0 || (sourceResults.args && sourceResults.args.media_keyword)))) {
      resultContent = (
        <SourceResultsTable
          title={formatMessage(localMessages.title, { name: selectedMediaQueryKeyword })}
          sources={sourceResults.list}
          handleToggleAndSelectMedia={handleToggleAndSelectMedia}
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
  fetchStatus: PropTypes.string,
  handleToggleAndSelectMedia: PropTypes.func.isRequired,
  updateMediaQuerySelection: PropTypes.func.isRequired,
  updateAdvancedMediaQuerySelection: PropTypes.func.isRequired,
  selectedMediaQueryKeyword: PropTypes.string,
  selectedMediaQueryType: PropTypes.number,
  sourceResults: PropTypes.object,
  formQuery: PropTypes.object,
};

const mapStateToProps = state => ({
  fetchStatus: state.system.mediaPicker.sourceQueryResults.fetchStatus,
  selectedMediaQueryType: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.type : 0,
  selectedMediaQueryKeyword: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.mediaKeyword : null,
  sourceResults: state.system.mediaPicker.sourceQueryResults,
  formQuery: formSelector(
    state,
    'advanced-media-picker-search.publicationCountry',
    'advanced-media-picker-search.publicationState',
    'advanced-media-picker-search.primaryLanguage',
    'advanced-media-picker-search.countryOfFocus',
    'advanced-media-picker-search.mediaType',
  ),
});

const mapDispatchToProps = dispatch => ({
  updateMediaQuerySelection: (values) => {
    if (values && notEmptyString(values.mediaKeyword)) {
      dispatch(selectMediaPickerQueryArgs(values));
      dispatch(fetchMediaPickerSources({ media_keyword: values.mediaKeyword }));
    }
  },
  updateAdvancedMediaQuerySelection: (values) => {
    if (values.tags && values.tags.length > 0) {
      dispatch(selectMediaPickerQueryArgs(values));
      dispatch(fetchMediaPickerSources({ media_keyword: values.mediaKeyword || '*', tags: values.tags }));
    }
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    SourceSearchResultsContainer
  )
);
