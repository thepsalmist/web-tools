import PropTypes from 'prop-types';
import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import withIntlForm from '../hocs/IntlForm';
import MediaPickerMetadataContainer from '../MediaPickerMetadataContainer';
import MediaTypesFieldArray from '../MediaTypesFieldArray';
import AppButton from '../AppButton';
import messages from '../../../resources/messages';
import { PUBLICATION_COUNTRY, PUBLICATION_STATE, COUNTRY_OF_FOCUS, PRIMARY_LANGUAGE, MEDIA_TYPE } from '../../../lib/tagUtil';
import { ALL_MEDIA } from '../../../lib/mediaUtil';

const localMessages = {
  nameFieldLabel: { id: 'search.advanced.nameField.label', defaultMessage: 'Name:' },
  nameFieldSuggestion: { id: 'search.advanced.nameField.suggestion', defaultMessage: 'search by source name or URL' },
  filtersFieldLabel: { id: 'search.advanced.filtersField.label', defaultMessage: 'Filters:' },
  pubCountrySuggestion: { id: 'search.advanced.pubCountryTip', defaultMessage: 'pub country {count}' },
  pubStateSuggestion: { id: 'search.advanced.pubStateTip', defaultMessage: 'pub state {count}' },
  pLanguageSuggestion: { id: 'search.advanced.pLanguageTip', defaultMessage: 'language {count}' },
  pCountryOfFocusSuggestion: { id: 'search.advanced.pCountryOfFocusTip', defaultMessage: 'about place {count}' },
  pMediaType: { id: 'search.advanced.pMediaType', defaultMessage: 'media type {count}' },
  search: { id: 'system.mediaPicker.select.search', defaultMessage: 'Search' },
};

class AdvancedMediaPickerSearchForm extends React.Component {
  state = {
    mode: 1935, // HACK: (pub country) how do we default component state from the store?
  }

  componentDidMount() {
    // this.textInputRef.focus();
  }

  setMetaClick = (mode) => {
    // work like a toggle
    const { onQueryUpdateSelection } = this.props;
    if (mode === this.state.mode) {
      this.setState({ mode: null });
    } else {
      this.setState({ mode });
    }
    // save keyword
    onQueryUpdateSelection(mode, { mediaKeyword: this.textInputRef.value });
  }

  getTagsPerMetadata = (tagVals, type, retInt) => {
    const currentlySelected = tagVals.tags && tagVals.tags[type] ? tagVals.tags[type] : undefined;
    const count = currentlySelected ? currentlySelected.filter(m => m.value).length : 0;
    if (retInt) return count;
    if (count) {
      return `(${count})`;
    }
    return '';
  }

  focusQueryInputField = (input) => {
    if (input) {
      setTimeout(() => {
        input.focus();
      }, 100);
    }
  };

  handleSearchButtonClick = (evt, inputRef) => {
    const { onSearch } = this.props;
    evt.preventDefault();
    const searchStr = inputRef.value;
    onSearch({ mediaKeyword: searchStr });
  }

  selectMetaData = (mode, input, name) => {
    const { onQueryUpdateSelection } = this.props;
    // get the values from the metadata item, store so other components can access it (checkboxes)
    // this would be pushed in as previouslySelected into cbx components
    const searchStr = this.textInputRef.value;
    onQueryUpdateSelection(mode, { ...input, name, mediaKeyword: searchStr });
  }

  render() {
    const { initialValues, renderTextField, mediaMetadataSetsByName } = this.props;
    const { formatMessage } = this.props.intl;
    const backgroundColorStyle = mode => (mode === this.state.mode ? 'lightgray' : 'white');
    const mediaType = this.state.mode === mediaMetadataSetsByName.mediaTypeSet ? (
      <MediaTypesFieldArray
        id={mediaMetadataSetsByName.mediaTypeSet}
        name={MEDIA_TYPE}
        form="advanced-media-picker-search"
        label={formatMessage(messages.mediaTypeShort)}
        onChange={args => this.selectMetaData(formatMessage(messages.mediaTypeShort), args, MEDIA_TYPE)}
        previouslySelected={initialValues.tags}
      />
    ) : null;
    const pubCountry = this.state.mode === mediaMetadataSetsByName.mediaPubCountrySet ? (
      <MediaPickerMetadataContainer
        id={mediaMetadataSetsByName.mediaPubCountrySet}
        type={PUBLICATION_COUNTRY}
        form="advanced-media-picker-search"
        label={formatMessage(messages.pubCountryShort)}
        onChange={(id, args) => this.selectMetaData(formatMessage(messages.pubCountryShort), args, PUBLICATION_COUNTRY)}
        onSearch={val => this.updateAndSearchWithSelection(val)}
        previouslySelectedTags={initialValues.tags}
        className="media-picker-pub-in"
      />
    ) : null;
    const pubState = this.state.mode === mediaMetadataSetsByName.mediaPubStateSet ? (
      <MediaPickerMetadataContainer
        id={mediaMetadataSetsByName.mediaPubStateSet}
        type={PUBLICATION_STATE}
        form="advanced-media-picker-search"
        label={formatMessage(messages.pubStateShort)}
        onChange={(id, args) => this.selectMetaData(formatMessage(messages.pubStateShort), args, PUBLICATION_STATE)}
        onSearch={val => this.updateAndSearchWithSelection(val)}
        previouslySelectedTags={initialValues.tags}
        className="media-picker-pub-in"
      />
    ) : null;
    const language = this.state.mode === mediaMetadataSetsByName.mediaPrimaryLanguageSet ? (
      <MediaPickerMetadataContainer
        id={mediaMetadataSetsByName.mediaPrimaryLanguageSet}
        type={PRIMARY_LANGUAGE}
        form="advanced-media-picker-search"
        label={formatMessage(messages.languageShort)}
        onChange={(id, args) => this.selectMetaData(formatMessage(messages.languageShort), args, PRIMARY_LANGUAGE)}
        onSearch={val => this.updateAndSearchWithSelection(val)}
        previouslySelectedTags={initialValues.tags}
        className="media-picker-pub-in"
      />
    ) : null;
    const countryOfFocus = this.state.mode === mediaMetadataSetsByName.mediaSubjectCountrySet ? (
      <MediaPickerMetadataContainer
        id={mediaMetadataSetsByName.mediaSubjectCountrySet}
        type={COUNTRY_OF_FOCUS}
        form="advanced-media-picker-search"
        label={formatMessage(messages.countryShort)}
        onChange={(id, args) => this.selectMetaData(formatMessage(messages.countryShort), args, COUNTRY_OF_FOCUS)}
        onSearch={val => this.updateAndSearchWithSelection(val)}
        previouslySelectedTags={initialValues.tags}
        className="media-picker-about"
      />
    ) : null;

    const content = (
      <div className="advanced-media-picker-search">
        <div name="advanced-media-picker-search">
          <Row>
            <Col lg={1}>
              <label className="categorical for-name" htmlFor="advancedSearchQueryString"><FormattedMessage {...localMessages.nameFieldLabel} /></label>
            </Col>
            <Col lg={6}>
              <Field
                name="advancedSearchQueryString"
                ref={(input) => { this.textInputRef = input; }}
                // inputRef={this.focusQueryInputField}
                component={renderTextField}
                label={formatMessage(localMessages.nameFieldSuggestion)}
                fullWidth
              />
            </Col>
          </Row>
          <Row>
            <Col lg={1}>
              <label className="categorical for-filters" htmlFor="filters"><FormattedMessage {...localMessages.filtersFieldLabel} /></label>
            </Col>
            <Col lg={11}>
              <div className="filter-options">
                <AppButton
                  style={{ backgroundColor: backgroundColorStyle(mediaMetadataSetsByName.mediaPubCountrySet) }}
                  label={formatMessage(localMessages.pubCountrySuggestion, { count: this.getTagsPerMetadata(initialValues, PUBLICATION_COUNTRY) })}
                  onClick={() => this.setMetaClick(mediaMetadataSetsByName.mediaPubCountrySet)}
                  disabled={this.state.mode === ALL_MEDIA}
                />
                <AppButton
                  style={{ backgroundColor: backgroundColorStyle(mediaMetadataSetsByName.mediaPrimaryLanguageSet) }}
                  label={formatMessage(localMessages.pLanguageSuggestion, { count: this.getTagsPerMetadata(initialValues, PRIMARY_LANGUAGE) })}
                  onClick={() => this.setMetaClick(mediaMetadataSetsByName.mediaPrimaryLanguageSet)}
                  disabled={this.state.mode === ALL_MEDIA}
                />
                <AppButton
                  style={{ backgroundColor: backgroundColorStyle(mediaMetadataSetsByName.mediaPubStateSet) }}
                  label={formatMessage(localMessages.pubStateSuggestion, { count: this.getTagsPerMetadata(initialValues, PUBLICATION_STATE) })}
                  onClick={() => this.setMetaClick(mediaMetadataSetsByName.mediaPubStateSet)}
                  disabled={this.state.mode === ALL_MEDIA}
                />
                <AppButton
                  style={{ backgroundColor: backgroundColorStyle(mediaMetadataSetsByName.mediaSubjectCountrySet) }}
                  label={formatMessage(localMessages.pCountryOfFocusSuggestion, { count: this.getTagsPerMetadata(initialValues, COUNTRY_OF_FOCUS) })}
                  onClick={() => this.setMetaClick(mediaMetadataSetsByName.mediaSubjectCountrySet)}
                  disabled={this.state.mode === ALL_MEDIA}
                />
                <AppButton
                  style={{ backgroundColor: backgroundColorStyle(mediaMetadataSetsByName.mediaTypeSet) }}
                  label={formatMessage(localMessages.pMediaType, { count: this.getTagsPerMetadata(initialValues, MEDIA_TYPE) })}
                  onClick={() => this.setMetaClick(mediaMetadataSetsByName.mediaTypeSet)}
                  disabled={this.state.mode === ALL_MEDIA}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              {pubCountry}
              {pubState}
              {countryOfFocus}
              {language}
              {mediaType}
            </Col>
          </Row>
          <Row>
            <Col lg={2}>
              <AppButton
                style={{ marginTop: 30 }}
                label={formatMessage(localMessages.search)}
                onClick={evt => this.handleSearchButtonClick(evt, this.textInputRef)}
                color="primary"
              />
            </Col>
          </Row>
        </div>
      </div>
    );

    return content;
  }
}

AdvancedMediaPickerSearchForm.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  // from form healper
  initialValues: PropTypes.object,
  handleSubmit: PropTypes.func,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  renderTextField: PropTypes.func.isRequired,
  hintText: PropTypes.string,
  // from parent
  onSearch: PropTypes.func,
  onQueryUpdateSelection: PropTypes.func,
  onSelectMediaType: PropTypes.func,
  searchString: PropTypes.string,
  mediaMetadataSetsByName: PropTypes.object.isRequired,
};

const reduxFormConfig = {
  form: 'advanced-media-picker-search',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  destroyOnUnmount: false,
};

export default
injectIntl(
  withIntlForm(
    reduxForm(reduxFormConfig)(
      AdvancedMediaPickerSearchForm
    )
  )
);
