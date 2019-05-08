import PropTypes from 'prop-types';
import React from 'react';
import { Field, reduxForm, FormSection, keepDirtyOnReinitialize, enableReinitialize } from 'redux-form';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import withIntlForm from '../hocs/IntlForm';
import DataCard from '../DataCard';
import MediaPickerMetadataContainer from '../MediaPickerMetadataContainer';
import MediaTypesFieldArray from '../MediaTypesFieldArray';
import MetadataCheckboxFieldArray from '../MetadataCheckboxFieldArray';
import AppButton from '../AppButton';
import messages from '../../../resources/messages';
import { TAG_SET_PUBLICATION_COUNTRY, TAG_SET_PUBLICATION_STATE, TAG_SET_PRIMARY_LANGUAGE, TAG_SET_COUNTRY_OF_FOCUS, TAG_SET_MEDIA_TYPE, PUBLICATION_COUNTRY, PUBLICATION_STATE, COUNTRY_OF_FOCUS, PRIMARY_LANGUAGE, MEDIA_TYPE } from '../../../lib/tagUtil';

const localMessages = {
  searchSuggestion: { id: 'search.advanced.searchTip', defaultMessage: 'search by source name' },
  pubCountrySuggestion: { id: 'search.advanced.pubCountryTip', defaultMessage: 'country published in {count}' },
  pubStateSuggestion: { id: 'search.advanced.pubStateTip', defaultMessage: 'state published in {count}' },
  pLanguageSuggestion: { id: 'search.advanced.pLanguageTip', defaultMessage: 'primary language {count}' },
  pCountryOfFocusSuggestion: { id: 'search.advanced.pCountryOfFocusTip', defaultMessage: 'country of focus {count}' },
  pMediaType: { id: 'search.advanced.pMediaType', defaultMessage: 'media type {count}' },
  search: { id: 'system.mediaPicker.select.search', defaultMessage: 'Search' },
  allMedia: { id: 'system.mediaPicker.select.allMedia', defaultMessage: 'Search All Media (not advised)' },
};

class AdvancedMediaPickerSearchForm extends React.Component {
  state = {
    mode: null,
  }

  setMetaClick = (mode) => {
    // evt.preventDefault();
    this.setState({ mode });
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

  handleSearchButtonClick = (evt, inputRef) => {
    const { onSearch } = this.props;
    evt.preventDefault();
    const searchStr = inputRef.value;
    onSearch({ mediaKeyword: searchStr });
  }

  selectMetaData = (mode, input, name) => {
    const { onMetadataSelection } = this.props;
    // get the values from the metadata item, store so other components can access it (checkboxes)
    // this would be pushed in as previouslySelected into cbx components
    onMetadataSelection(mode, { ...input, name });
  }


  handleSearchAll = (evt) => {
    const { onSearch } = this.props;
    onSearch({ allMedia: evt.target.checked });
  }

  render() {
    const { initValues, renderTextField, renderCheckbox } = this.props;
    const { formatMessage } = this.props.intl;
    const colorStyle = mode => (this.getTagsPerMetadata(initValues, mode, true) > 0 ? 'purple' : 'gray');
    const backgroundColorStyle = mode => (mode === this.state.mode ? 'lightgray' : 'white');
    const contentButtons = (
      <Row>
        <Col lg={6}>
          <AppButton
            style={{ marginTop: 10, color: colorStyle(PUBLICATION_COUNTRY), backgroundColor: backgroundColorStyle(TAG_SET_PUBLICATION_COUNTRY) }}
            label={formatMessage(localMessages.pubCountrySuggestion, { count: this.getTagsPerMetadata(initValues, PUBLICATION_COUNTRY) })}
            onClick={() => this.setMetaClick(TAG_SET_PUBLICATION_COUNTRY, PUBLICATION_COUNTRY)}
            secondary={this.state.mode === TAG_SET_PUBLICATION_COUNTRY}
          />
          <AppButton
            style={{ marginTop: 10, color: colorStyle(PUBLICATION_STATE), backgroundColor: backgroundColorStyle(TAG_SET_PUBLICATION_STATE) }}
            label={formatMessage(localMessages.pubStateSuggestion, { count: this.getTagsPerMetadata(initValues, PUBLICATION_STATE) })}
            onClick={() => this.setMetaClick(TAG_SET_PUBLICATION_STATE, PUBLICATION_STATE)}
            secondary={this.state.mode === TAG_SET_PUBLICATION_STATE}
          />
          <AppButton
            style={{ marginTop: 10, color: colorStyle(PRIMARY_LANGUAGE), backgroundColor: backgroundColorStyle(TAG_SET_PRIMARY_LANGUAGE) }}
            label={formatMessage(localMessages.pLanguageSuggestion, { count: this.getTagsPerMetadata(initValues, PRIMARY_LANGUAGE) })}
            onClick={() => this.setMetaClick(TAG_SET_PRIMARY_LANGUAGE, PRIMARY_LANGUAGE)}
            secondary={this.state.mode === TAG_SET_PRIMARY_LANGUAGE}
          />
          <AppButton
            style={{ marginTop: 10, color: colorStyle(COUNTRY_OF_FOCUS), backgroundColor: backgroundColorStyle(TAG_SET_COUNTRY_OF_FOCUS) }}
            label={formatMessage(localMessages.pCountryOfFocusSuggestion, { count: this.getTagsPerMetadata(initValues, COUNTRY_OF_FOCUS) })}
            onClick={() => this.setMetaClick(TAG_SET_COUNTRY_OF_FOCUS, COUNTRY_OF_FOCUS)}
            secondary={this.state.mode === TAG_SET_COUNTRY_OF_FOCUS}
          />
          <AppButton
            style={{ marginTop: 10, color: colorStyle(MEDIA_TYPE), backgroundColor: backgroundColorStyle(TAG_SET_MEDIA_TYPE) }}
            label={formatMessage(localMessages.pMediaType, { count: this.getTagsPerMetadata(initValues, MEDIA_TYPE) })}
            onClick={() => this.setMetaClick(TAG_SET_MEDIA_TYPE, MEDIA_TYPE)}
            secondary={this.state.mode === TAG_SET_MEDIA_TYPE}
          />
        </Col>
      </Row>
    );
    const pubCountry = this.state.mode === TAG_SET_PUBLICATION_COUNTRY ? (
      <MediaPickerMetadataContainer
        id={TAG_SET_PUBLICATION_COUNTRY}
        type={PUBLICATION_COUNTRY}
        form="advanced-media-picker-search"
        label={formatMessage(messages.pubCountry)}
        onChange={(...args) => this.selectMetaData(TAG_SET_PUBLICATION_COUNTRY, args, PUBLICATION_COUNTRY)}
        onSearch={val => this.updateAndSearchWithSelection(val)}
        previouslySelectedTags={initValues.tags}
      />
    ) : null;
    const pubState = this.state.mode === TAG_SET_PUBLICATION_STATE ? (
      <div>
        <MediaPickerMetadataContainer
          id={TAG_SET_PUBLICATION_STATE}
          type={PUBLICATION_STATE}
          form="advanced-media-picker-search"
          label={formatMessage(messages.pubState)}
          onChange={(...args) => this.selectMetaData(TAG_SET_PUBLICATION_STATE, args, PUBLICATION_STATE)}
          onSearch={val => this.updateAndSearchWithSelection(val)}
          previouslySelectedTags={initValues.tags}
        />
      </div>
    ) : null;
    const countryOfFocus = this.state.mode === TAG_SET_COUNTRY_OF_FOCUS ? (
      <div>
        <MediaPickerMetadataContainer
          id={TAG_SET_COUNTRY_OF_FOCUS}
          type={COUNTRY_OF_FOCUS}
          form="advanced-media-picker-search"
          label={formatMessage(messages.language)}
          onChange={(...args) => this.selectMetaData(TAG_SET_COUNTRY_OF_FOCUS, args, COUNTRY_OF_FOCUS)}
          onSearch={val => this.updateAndSearchWithSelection(val)}
          previouslySelectedTags={initValues.tags}
        />
      </div>
    ) : null;
    const language = this.state.mode === TAG_SET_PRIMARY_LANGUAGE ? (
      <DataCard>
        <MetadataCheckboxFieldArray
          id={TAG_SET_PRIMARY_LANGUAGE}
          type={PRIMARY_LANGUAGE}
          form="advanced-media-picker-search"
          label={formatMessage(messages.language)}
          onChange={(...args) => this.selectMetaData(TAG_SET_PUBLICATION_STATE, args, PRIMARY_LANGUAGE)}
          previouslySelected={initValues.tags}
        />
      </DataCard>
    ) : null;
    const mediaType = this.state.mode === TAG_SET_MEDIA_TYPE ? (
      <MediaTypesFieldArray
        id={TAG_SET_MEDIA_TYPE}
        name={MEDIA_TYPE}
        form="advanced-media-picker-search"
        label={formatMessage(messages.mediaType)}
        onChange={(...args) => this.selectMetaData(TAG_SET_MEDIA_TYPE, args, MEDIA_TYPE)}
        onSelect={this.setSelectedMediaTypes}
        previouslySelected={initValues.tags}
      />
    ) : null;

    const content = (
      <FormSection name="advanced-media-picker-search">
        <Row>
          <Col lg={6}>
            <Field
              name="advancedSearchQueryString"
              value={initValues}
              ref={(input) => { this.textInputRef = input; }}
              component={renderTextField}
              label={formatMessage(localMessages.searchSuggestion)}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            {contentButtons}
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            {pubCountry}
            {pubState}
            {countryOfFocus}
            {language}
            {mediaType}
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <Field
              name="allMedia"
              component={renderCheckbox}
              fullWidth
              label={localMessages.allMedia}
              helpertext={localMessages.allMedia}
              onChange={this.handleSearchAll}
            />
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
      </FormSection>
    );

    return content;
  }
}

AdvancedMediaPickerSearchForm.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  // from form healper
  initValues: PropTypes.object,
  handleSubmit: PropTypes.func,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  renderTextField: PropTypes.func.isRequired,
  renderCheckbox: PropTypes.func.isRequired,
  hintText: PropTypes.string,
  // from parent
  onSearch: PropTypes.func,
  onMetadataSelection: PropTypes.func,
  onSelectMediaType: PropTypes.func,
  searchString: PropTypes.string,
};

const reduxFormConfig = {
  form: 'advanced-media-picker-search',
  enableReinitialize,
  keepDirtyOnReinitialize,
};

export default
injectIntl(
  withIntlForm(
    reduxForm(reduxFormConfig)(
      AdvancedMediaPickerSearchForm
    )
  )
);
