import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, FieldArray, Field, propTypes } from 'redux-form';
import { injectIntl } from 'react-intl';
import withIntlForm from './hocs/IntlForm';
import withAsyncData from './hocs/AsyncDataContainer';
import { fetchMetadataValuesForMediaType } from '../../actions/systemActions';
import { TAG_SET_MEDIA_TYPE } from '../../lib/tagUtil';
import messages from '../../resources/messages';

const MediaTypesSelector = ({ initialValues, renderCheckbox, intl: { formatMessage }, fields }) => (
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
                {renderCheckbox({ ...info, label: fieldObject.label, input: { ...info.input, name: fieldObject.label, value: fieldObject.selected } })}
              </div>
            )}
            label={name}
            placeholder={formatMessage(messages.ok)}
          />
        </li>
      );
    })}
  </ul>
);

MediaTypesSelector.propTypes = {
  fields: PropTypes.object,
  initialValues: PropTypes.object,
  renderCheckbox: PropTypes.func.isRequired,
  intl: PropTypes.object,
};

const MediaTypesList = injectIntl(withIntlForm(MediaTypesSelector));

const MediaTypesFieldArray = props => (
  <div className="explorer-media-picker-media-types">
    <FieldArray
      form="advanced-media-picker-search"
      name="mediaType"
      component={MediaTypesList}
      initialValues={props.initialValues}
    />
  </div>
);

MediaTypesFieldArray.propTypes = {
  // from parent
  intl: PropTypes.object.isRequired,
  tags: PropTypes.array,
  name: PropTypes.string,
  initialValues: PropTypes.object,
};

const mapStateToProps = state => ({
  fetchStatus: state.system.metadata.mediaType.fetchStatus,
  // mediaType: state.system.metadata.mediaType.tags.length ? state.system.metadata.mediaType.tags : null,
  initialValues: { mediaType: state.system.metadata.mediaType.tags },
});

const fetchAsyncData = dispatch => dispatch(fetchMetadataValuesForMediaType(TAG_SET_MEDIA_TYPE));


export default
injectIntl(
  connect(mapStateToProps)(
    withAsyncData(fetchAsyncData)(
      withIntlForm(
        reduxForm({ propTypes })(
          MediaTypesFieldArray
        )
      )
    )
  )
);
