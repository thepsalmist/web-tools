import PropTypes from 'prop-types';
import React from 'react';
import { Field, reduxForm, FormSection } from 'redux-form';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import withIntlForm from '../hocs/IntlForm';
import MetadataPickerContainer from '../MetadataPickerContainer';
// import MediaPickerSearchForm from './MediaPickerSearchForm';
import AppButton from '../AppButton';
import messages from '../../../resources/messages';
import { TAG_SET_PUBLICATION_COUNTRY, TAG_SET_PUBLICATION_STATE, TAG_SET_PRIMARY_LANGUAGE, TAG_SET_COUNTRY_OF_FOCUS, TAG_SET_MEDIA_TYPE } from '../../../lib/tagUtil';

const localMessages = {
  searchSuggestion: { id: 'search.advanced.searchTip', defaultMessage: 'match these words' },
  pubCountrySuggestion: { id: 'search.advanced.pubCountryTip', defaultMessage: 'country published in' },
  pubStateSuggestion: { id: 'search.advanced.pubStateTip', defaultMessage: 'state published in' },
  pLanguageSuggestion: { id: 'search.advanced.pLanguageTip', defaultMessage: 'primary language' },
  pCountryOfFocusSuggestion: { id: 'search.advanced.pCountryOfFocusTip', defaultMessage: 'country of focus' },
  pMediaType: { id: 'search.advanced.pMediaType', defaultMessage: 'media type' },
  search: { id: 'system.mediaPicker.select.search', defaultMessage: 'Search' },
  allMedia: { id: 'system.mediaPicker.select.allMedia', defaultMessage: 'Search All Media (not advised)' },
};

class AdvancedMediaPickerSearchForm extends React.Component {
  state = {
    mode: null,
  }

  handleSearchButtonClick = (evt, inputRef) => {
    const { onAdvancedSelection } = this.props;
    evt.preventDefault();
    const searchStr = inputRef.value;
    onAdvancedSelection({ mediaKeyword: searchStr });
  }

  handleMetaClick = (mode) => {
    // evt.preventDefault();
    this.setState({ mode });
  }

  handleSearchAll = (evt) => {
    const { onAdvancedSelection } = this.props;
    onAdvancedSelection({ allMedia: evt.target.checked });
  }

  render() {
    const { initValues, renderTextField, renderCheckbox } = this.props;
    const { formatMessage } = this.props.intl;

    const contentButtons = (
      <Row>
        <Col lg={6}>
          <AppButton
            style={{ marginTop: 10 }}
            label={formatMessage(localMessages.pubCountrySuggestion)}
            onClick={() => this.handleMetaClick(TAG_SET_PUBLICATION_COUNTRY)}
            color="primary"
          />
          <AppButton
            style={{ marginTop: 10 }}
            label={formatMessage(localMessages.pubStateSuggestion)}
            onClick={() => this.handleMetaClick(TAG_SET_PUBLICATION_STATE)}
            color="primary"
          />
          <AppButton
            style={{ marginTop: 10 }}
            label={formatMessage(localMessages.pLanguageSuggestion)}
            onClick={() => this.handleMetaClick(TAG_SET_PRIMARY_LANGUAGE)}
            color="primary"
          />
          <AppButton
            style={{ marginTop: 10 }}
            label={formatMessage(localMessages.pCountryOfFocusSuggestion)}
            onClick={() => this.handleMetaClick(TAG_SET_COUNTRY_OF_FOCUS)}
            color="primary"
          />
          <AppButton
            style={{ marginTop: 10 }}
            label={formatMessage(localMessages.pMediaType)}
            onClick={() => this.handleMetaClick(TAG_SET_MEDIA_TYPE)}
            color="primary"
          />
        </Col>
      </Row>
    );
    const pubCountry = this.state.mode === TAG_SET_PUBLICATION_COUNTRY ? (
      <MetadataPickerContainer
        id={TAG_SET_PUBLICATION_COUNTRY}
        name="publicationCountry"
        form="advanced-media-picker-search"
        label={formatMessage(messages.pubCountry)}
        async
      />
    ) : null;
    const pubState = this.state.mode === TAG_SET_PUBLICATION_STATE ? (
      <MetadataPickerContainer
        id={TAG_SET_PUBLICATION_STATE}
        name="publicationState"
        form="advanced-media-picker-search"
        label={formatMessage(messages.pubState)}
        async
      />
    ) : null;
    const countryOfFocus = this.state.mode === TAG_SET_COUNTRY_OF_FOCUS ? (
      <MetadataPickerContainer
        id={TAG_SET_COUNTRY_OF_FOCUS}
        name="countryOfFocus"
        form="advanced-media-picker-search"
        label={formatMessage(messages.countryOfFocus)}
        async
      />
    ) : null;
    const language = this.state.mode === TAG_SET_PRIMARY_LANGUAGE ? (
      <MetadataPickerContainer
        id={TAG_SET_PRIMARY_LANGUAGE}
        name="primaryLanguage"
        form="advanced-media-picker-search"
        label={formatMessage(messages.language)}
        async
      />
    ) : null;
    const mediaType = this.state.mode === TAG_SET_MEDIA_TYPE ? (
      <MetadataPickerContainer
        id={TAG_SET_MEDIA_TYPE}
        name="mediaType"
        form="advanced-media-picker-search"
        label={formatMessage(messages.mediaType)}
        async
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
              fullWidth
            />
          </Col>
          <Col lg={2}>
            <AppButton
              style={{ marginTop: 30 }}
              label={formatMessage(localMessages.search)}
              onClick={evt => this.handleSearchButtonClick(evt, this.textInputRef)}
              color="primary"
            />
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
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
  onAdvancedSelection: PropTypes.func.isRequired,
  searchString: PropTypes.string,
};

const reduxFormConfig = {
  form: 'advanced-media-picker-search',
};

export default
injectIntl(
  withIntlForm(
    reduxForm(reduxFormConfig)(
      AdvancedMediaPickerSearchForm
    )
  )
);
