import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import { injectIntl } from 'react-intl';
import withIntlForm from './hocs/IntlForm';
import withAsyncData from './hocs/AsyncDataContainer';
import { fetchMetadataValuesForMediaType } from '../../actions/systemActions';

const MediaTypesFieldArray = (props) => {
  const { types, renderCheckbox } = props;
  return (
    <ul>
      {types.map((t, idx) => (
        <li key={idx}>
          <Field
            component={renderCheckbox}
            name={`mediaType.${t.tags_id}`} // prefacing the name with the type for form
            label={t.label}
          />
        </li>
      ))}
    </ul>
  );
};

MediaTypesFieldArray.propTypes = {
  types: PropTypes.array,
  // form context
  intl: PropTypes.object.isRequired,
  renderCheckbox: PropTypes.func.isRequired,
  mediaTypeSet: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.system.metadata.mediaType.fetchStatus,
  types: state.system.metadata.mediaType.tags.length ? state.system.metadata.mediaType.tags : null,
  mediaTypeSet: state.system.staticTags.tagSets.mediaTypeSet,
});

const fetchAsyncData = (dispatch, { mediaTypeSet }) => dispatch(fetchMetadataValuesForMediaType(mediaTypeSet));

export default
injectIntl(
  connect(mapStateToProps)(
    withAsyncData(fetchAsyncData)(
      withIntlForm(
        MediaTypesFieldArray
      )
    )
  )
);
