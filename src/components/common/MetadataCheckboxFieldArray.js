import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, FieldArray, Field, propTypes } from 'redux-form';
import { injectIntl } from 'react-intl';
import { FETCH_SUCCEEDED } from '../../lib/fetchConstants';
import withIntlForm from './hocs/IntlForm';
import withAsyncData from './hocs/AsyncDataContainer';
import { fetchMetadataValuesForCountry, fetchMetadataValuesForState, fetchMetadataValuesForPrimaryLanguage, fetchMetadataValuesForCountryOfFocus } from '../../actions/systemActions';
import { TAG_SET_PUBLICATION_COUNTRY, TAG_SET_PUBLICATION_STATE, TAG_SET_PRIMARY_LANGUAGE, TAG_SET_COUNTRY_OF_FOCUS } from '../../lib/tagUtil';
import messages from '../../resources/messages';

const localMessages = {
  label: { id: 'system.mediaPicker.sources.label', defaultMessage: '{label}' },
};

const MetadataCheckboxSelector = ({ initialValues, renderCheckbox, onChange, intl: { formatMessage }, fields }) => (
  <ul>
    {fields.map((name, index, thisFieldArray) => { // redux-form overrides map, and converts name to a string instead of an object!
      const fieldObject = thisFieldArray.get(index);
      return (
        <li key={index}>
          <Field
            initialValues={initialValues}
            key={index}
            name={`${name}.label`}
            component={info => (
              <div>
                {renderCheckbox({ ...info, label: formatMessage(localMessages.label, { label: fieldObject.label }), input: { ...info.input, ...fieldObject, value: fieldObject.selected, onChange } })}
              </div>
            )}
            label={`${name}.label`}
            placeholder={formatMessage(messages.ok)}
          />
        </li>
      );
    })}
  </ul>
);

MetadataCheckboxSelector.propTypes = {
  fields: PropTypes.object,
  initialValues: PropTypes.array,
  renderCheckbox: PropTypes.func.isRequired,
  intl: PropTypes.object,
  onChange: PropTypes.func,
};

const MetadataCheckboxList = injectIntl(withIntlForm(MetadataCheckboxSelector));

const MetadataCheckboxFieldArray = (props) => {
  const metaAndSelected = { ...props.initialValues };
  if (props.previouslySelected && props.previouslySelected[props.type]) {
    props.previouslySelected[props.type].forEach((p) => {
      const toUpdate = metaAndSelected.shortList.findIndex(t => t.tags_id === p.tags_id);
      if (toUpdate > -1) {
        metaAndSelected.shortList[toUpdate].selected = p.value !== false && p.value !== undefined;
        metaAndSelected.shortList[toUpdate].value = p.value !== false && p.value !== undefined;
      } else {
        metaAndSelected.shortList.push(p); // from AutoComplete
      }
    });
  }
  return (
    <div className="explorer-media-picker-media-types">
      <FieldArray
        form="advanced-media-picker-search"
        name="shortList"
        component={MetadataCheckboxList}
        initialValues={metaAndSelected}
        onChange={props.onChange}
      />
    </div>
  );
};

MetadataCheckboxFieldArray.propTypes = {
  // from parent
  intl: PropTypes.object.isRequired,
  type: PropTypes.string,
  initialValues: PropTypes.object,
  previouslySelected: PropTypes.array,
  onChange: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
  fetchStatus: state.system.metadata[ownProps.type].fetchStatus,
  label: state.system.metadata[ownProps.type].label,
  initialValues: state.system.metadata[ownProps.type],
});

const fetchAsyncData = (dispatch, props) => {
  const alreadyLoadedTags = ((props.fetchStatus === FETCH_SUCCEEDED) && (props.initialValues.shortList.length > 0));
  if (!alreadyLoadedTags) {
    let fetcher;
    switch (props.id) {
      case TAG_SET_PUBLICATION_COUNTRY:
        fetcher = fetchMetadataValuesForCountry;
        break;
      case TAG_SET_PUBLICATION_STATE:
        fetcher = fetchMetadataValuesForState;
        break;
      case TAG_SET_PRIMARY_LANGUAGE:
        fetcher = fetchMetadataValuesForPrimaryLanguage;
        break;
      case TAG_SET_COUNTRY_OF_FOCUS:
        fetcher = fetchMetadataValuesForCountryOfFocus;
        break;
      // case TAG_SET_MEDIA_TYPE:
        // fetcher = fetchMetadataValuesForMediaType;
        // break;
      default:
        break;
    }
    if (fetcher) {
      return dispatch(fetcher(props.id));
    }
  }
  return null;
};

export default
injectIntl(
  connect(mapStateToProps)(
    withAsyncData(fetchAsyncData)(
      withIntlForm(
        reduxForm({ propTypes })(
          MetadataCheckboxFieldArray
        )
      )
    )
  )
);
