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

const localMessages = {
  label: { id: 'system.mediaPicker.sources.label', defaultMessage: '{label}' },
};

const MediaTypesSelector = ({ mediaTypeValues, renderCheckbox, onChange, intl: { formatMessage }, fields }) => (
  <ul>
    {fields.map((name, index, thisFieldArray) => { // redux-form overrides map, and converts name to a string instead of an object!
      const fieldObject = thisFieldArray.get(index);
      return (
        <li key={index}>
          <Field
            initialValues={mediaTypeValues}
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

MediaTypesSelector.propTypes = {
  fields: PropTypes.object,
  mediaTypeValues: PropTypes.object,
  renderCheckbox: PropTypes.func.isRequired,
  intl: PropTypes.object,
  onChange: PropTypes.func,
};

const MediaTypesList = injectIntl(withIntlForm(MediaTypesSelector));

const MediaTypesFieldArray = (props) => {
  const previouslySelected = Object.values(props.initialValues).filter(t => t.length > 0).reduce((a, b) => a.concat(b), []).map(i => i.tags_id);
  const updatesToMake = props.mediaTypes.mediaType.filter(m => m.tags_id === previouslySelected);
  updatesToMake.forEach((u) => {
    updatesToMake.selected = props.initialValues.find(t => t.tags_id === u.tags_id);
  });
  return (
    <div className="explorer-media-picker-media-types">
      <FieldArray
        form="advanced-media-picker-search"
        name="mediaType"
        component={MediaTypesList}
        initialValues={props.initialValues}
        onChange={props.onChange}
      />
    </div>
  );
};

MediaTypesFieldArray.propTypes = {
  // from parent
  intl: PropTypes.object.isRequired,
  tags: PropTypes.array,
  name: PropTypes.string,
  initialValues: PropTypes.object,
  mediaTypes: PropTypes.object,
  onChange: PropTypes.func,
};

const mapStateToProps = state => ({
  fetchStatus: state.system.metadata.mediaType.fetchStatus,
  // mediaType: state.system.metadata.mediaType.tags.length ? state.system.metadata.mediaType.tags : null,
  mediaTypes: { mediaType: state.system.metadata.mediaType.tags },
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
